import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SolicitudServicio, SolicitudEstado } from '../service-requests/solicitud-servicio.entity';
import { DiagnosticoIA } from '../triage/diagnostico-ia.entity';
import { Usuario, UserRole } from '../users/usuario.entity';
import { Cliente } from '../clients/cliente.entity';
import { TriageService } from '../triage/triage.service';

@Injectable()
export class PublicService {
  private readonly logger = new Logger(PublicService.name);

  constructor(
    @InjectRepository(SolicitudServicio)
    private solicitudRepo: Repository<SolicitudServicio>,
    @InjectRepository(DiagnosticoIA)
    private diagnosticoRepo: Repository<DiagnosticoIA>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    private triageService: TriageService,
  ) {}

  async crearSolicitud(dto: {
    nombre: string;
    telefono: string;
    email?: string;
    direccion: string;
    distrito: string;
    descripcion_problema: string;
    tipo_equipo?: string;
    marca?: string;
    modelo?: string;
    referencia_direccion?: string;
  }) {
    let usuario = await this.usuarioRepo.findOne({ where: { email: dto.email || dto.telefono } });
    if (!usuario) {
      const password_hash = await bcrypt.hash(dto.telefono, 12);
      usuario = this.usuarioRepo.create({
        email: dto.email || `${dto.telefono}@public.tecniya.pe`,
        password_hash,
        nombre_completo: dto.nombre,
        telefono: dto.telefono,
        rol: UserRole.CLIENTE,
        activo: true,
      });
      await this.usuarioRepo.save(usuario);
    }

    let cliente = await this.clienteRepo.findOne({ where: { usuario_id: usuario.id } });
    if (!cliente) {
      cliente = this.clienteRepo.create({
        usuario_id: usuario.id,
        direccion: dto.direccion,
        distrito: dto.distrito,
        referencia_direccion: dto.referencia_direccion,
      });
      await this.clienteRepo.save(cliente);
    }

    const solicitud = this.solicitudRepo.create({
      cliente_id: cliente.id,
      descripcion_problema: dto.descripcion_problema,
      tipo_equipo: dto.tipo_equipo,
      marca: dto.marca,
      modelo: dto.modelo,
      estado: SolicitudEstado.PENDIENTE,
    });

    const saved = await this.solicitudRepo.save(solicitud);

    let diagnostico: any = {
      tipo_falla: 'Pendiente',
      urgencia: 'media',
      tiempo_estimado_min: 60,
      costo_estimado: 50,
      confianza: 0.5,
      recomendaciones: '',
      modelo_ia: '',
      latencia_ms: 0,
    };

    try {
      diagnostico = await this.triageService.analizar(saved.id, dto.descripcion_problema);

      const diagEntity = this.diagnosticoRepo.create({
        solicitud_id: saved.id,
        tipo_falla: diagnostico.tipo_falla,
        urgencia: diagnostico.urgencia,
        tiempo_estimado_min: diagnostico.tiempo_estimado_min,
        costo_estimado: diagnostico.costo_estimado,
        confianza: diagnostico.confianza,
        recomendaciones: diagnostico.recomendaciones,
        modelo_ia: diagnostico.modelo_ia,
        latencia_ms: diagnostico.latencia_ms,
        raw_response: diagnostico.raw_response,
      });
      await this.diagnosticoRepo.save(diagEntity);

      saved.tipo_falla = diagnostico.tipo_falla;
      saved.urgencia = diagnostico.urgencia;
      saved.tiempo_estimado_min = diagnostico.tiempo_estimado_min;
      saved.costo_estimado = diagnostico.costo_estimado;
      saved.confianza_diagnostico = diagnostico.confianza;
      saved.estado = SolicitudEstado.COTIZADO;
      await this.solicitudRepo.save(saved);
    } catch (error) {
      this.logger.error('Error en triage automático', error);
    }

    return {
      solicitud_id: saved.id,
      estado: saved.estado,
      tipo_falla: diagnostico.tipo_falla,
      urgencia: diagnostico.urgencia,
      tiempo_estimado_min: diagnostico.tiempo_estimado_min,
      costo_estimado: diagnostico.costo_estimado,
      confianza: diagnostico.confianza,
      recomendaciones: diagnostico.recomendaciones,
      created_at: saved.created_at,
    };
  }

  async consultarEstado(id: string) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['diagnostico', 'tecnico', 'tecnico.usuario'],
    });
    if (!solicitud) return null;

    return {
      id: solicitud.id,
      estado: solicitud.estado,
      tipo_falla: solicitud.tipo_falla,
      urgencia: solicitud.urgencia,
      tiempo_estimado_min: solicitud.tiempo_estimado_min,
      costo_estimado: solicitud.costo_estimado,
      costo_final: solicitud.costo_final,
      created_at: solicitud.created_at,
      tecnico: solicitud.tecnico ? {
        nombre: solicitud.tecnico.usuario?.nombre_completo,
        telefono: solicitud.tecnico.usuario?.telefono,
      } : null,
    };
  }
}
