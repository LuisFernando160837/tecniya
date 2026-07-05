import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { DiagnosticoIA } from './diagnostico-ia.entity';

const TRIAGE_PROMPT = `Eres un asistente experto en diagnóstico de fallas de computadoras, laptops, celulares y equipos electrónicos. 
Tu tarea es analizar la descripción del problema que reporta un cliente y devolver exclusivamente un objeto JSON con esta estructura exacta, sin texto adicional:

{
  "tipo_falla": "categoría específica de la falla en español",
  "urgencia": "baja" | "media" | "alta",
  "tiempo_estimado_min": número entero (minutos estimados de reparación),
  "costo_estimado": número decimal (costo estimado en soles peruanos, PEN),
  "confianza": número decimal entre 0 y 1 (nivel de confianza del diagnóstico),
  "recomendaciones": "breve recomendación para el cliente en español, máximo 100 caracteres"
}

Reglas:
- tipo_falla debe ser específico: "Pantalla rota", "Batería no carga", "No enciende", "Problema de software", "Conectividad WiFi", "Teclado dañado", "Sobrecalentamiento", "Disco duro dañado", "Virus/Malware", "Altavoz/Micrófono", "Puerto USB dañado", "Otro"
- urgencia: "alta" si impide usar el equipo, "media" si afecta funcionalidad pero se puede usar, "baja" si es cosmético o no urgente
- tiempo_estimado_min: entre 15 y 240 minutos
- costo_estimado: entre 15 y 500 soles
- confianza: entre 0.5 y 0.99
- Responde SOLO con el JSON, sin explicaciones ni texto adicional`;

@Injectable()
export class TriageService {
  private readonly logger = new Logger(TriageService.name);
  private readonly ollamaUrl: string;
  private readonly modelName: string;

  constructor(
    private httpService: HttpService,
    @InjectRepository(DiagnosticoIA)
    private diagnosticoRepo: Repository<DiagnosticoIA>,
  ) {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.modelName = process.env.OLLAMA_MODEL || 'llama3:8b';
  }

  async analizar(
    solicitudId: string,
    descripcion: string,
  ): Promise<{
    tipo_falla: string;
    urgencia: string;
    tiempo_estimado_min: number;
    costo_estimado: number;
    confianza: number;
    recomendaciones: string;
    modelo_ia: string;
    latencia_ms: number;
    raw_response: any;
  }> {
    const startTime = Date.now();

    try {
      const response: any = await firstValueFrom(
        this.httpService.post(`${this.ollamaUrl}/api/generate`, {
          model: this.modelName,
          prompt: `${TRIAGE_PROMPT}\n\nDescripción del problema del cliente:\n"${descripcion}"`,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.1,
            num_predict: 512,
          },
        }),
      );

      const latencia = Date.now() - startTime;
      let result: any;

      try {
        const text = response.data?.response || '{}';
        result = JSON.parse(text);
      } catch {
        try {
          const match = response.data?.response?.match(/\{[\s\S]*\}/);
          result = match ? JSON.parse(match[0]) : null;
        } catch {
          result = null;
        }
      }

      if (!result || !result.tipo_falla) {
        return this.getDefaultDiagnostico(solicitudId, latencia, response.data);
      }

      return {
        tipo_falla: result.tipo_falla || 'Otro',
        urgencia: ['baja', 'media', 'alta'].includes(result.urgencia) ? result.urgencia : 'media',
        tiempo_estimado_min: Math.min(Math.max(result.tiempo_estimado_min || 60, 15), 240),
        costo_estimado: Math.min(Math.max(result.costo_estimado || 50, 15), 500),
        confianza: Math.min(Math.max(result.confianza || 0.7, 0.5), 0.99),
        recomendaciones: (result.recomendaciones || '').substring(0, 100),
        modelo_ia: this.modelName,
        latencia_ms: latencia,
        raw_response: response.data,
      };
    } catch (error) {
      this.logger.error(`Error conectando con Ollama: ${error.message}`, error.stack);
      return this.getDefaultDiagnostico(solicitudId, Date.now() - startTime, { error: error.message });
    }
  }

  private getDefaultDiagnostico(solicitudId: string, latencia: number, rawResponse: any) {
    return {
      tipo_falla: 'Otro',
      urgencia: 'media',
      tiempo_estimado_min: 60,
      costo_estimado: 50,
      confianza: 0.5,
      recomendaciones: 'Se requiere evaluación presencial del técnico.',
      modelo_ia: this.modelName,
      latencia_ms: latencia,
      raw_response: rawResponse,
    };
  }

  async getDiagnosticHistory(solicitudId: string): Promise<DiagnosticoIA | null> {
    return this.diagnosticoRepo.findOne({
      where: { solicitud_id: solicitudId },
    });
  }
}
