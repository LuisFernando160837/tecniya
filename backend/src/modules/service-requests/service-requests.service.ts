import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudServicio, SolicitudEstado } from './solicitud-servicio.entity';
import { DiagnosticoIA } from '../triage/diagnostico-ia.entity';
import { TriageService } from '../triage/triage.service';

@Injectable()
export class ServiceRequestsService {
  private readonly logger = new Logger(ServiceRequestsService.name);

  constructor(
    @InjectRepository(SolicitudServicio)
    private solicitudRepo: Repository<SolicitudServicio>,
    @InjectRepository(DiagnosticoIA)
    private diagnosticoRepo: Repository<DiagnosticoIA>,
    private triageService: TriageService,
  ) {}

  async findAll(filters?: {
    cliente_id?: string;
    tecnico_id?: string;
    estado?: SolicitudEstado;
  }): Promise<SolicitudServicio[]> {
    const where: any = {};
    if (filters?.cliente_id) where.cliente_id = filters.cliente_id;
    if (filters?.tecnico_id) where.tecnico_id = filters.tecnico_id;
    if (filters?.estado) where.estado = filters.estado;

    return this.solicitudRepo.find({
      where,
      relations: ['cliente', 'cliente.usuario', 'tecnico', 'tecnico.usuario', 'diagnostico', 'pago', 'calificacion'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<SolicitudServicio> {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['cliente', 'cliente.usuario', 'tecnico', 'tecnico.usuario', 'diagnostico', 'pago', 'calificacion'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    return solicitud;
  }

  async create(dto: {
    cliente_id: string;
    descripcion_problema: string;
    foto_problema_url?: string;
    equipo_id?: string;
  }): Promise<SolicitudServicio> {
    const solicitud = this.solicitudRepo.create({
      cliente_id: dto.cliente_id,
      descripcion_problema: dto.descripcion_problema,
      foto_problema_url: dto.foto_problema_url,
      estado: SolicitudEstado.PENDIENTE,
    });

    const saved = await this.solicitudRepo.save(solicitud);

    try {
      const diagnostico = await this.triageService.analizar(saved.id, dto.descripcion_problema);
      saved.tipo_falla = diagnostico.tipo_falla;
      saved.urgencia = diagnostico.urgencia;
      saved.tiempo_estimado_min = diagnostico.tiempo_estimado_min;
      saved.costo_estimado = diagnostico.costo_estimado;
      saved.confianza_diagnostico = diagnostico.confianza;
      saved.estado = SolicitudEstado.COTIZADO;

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
        raw_response: diagnostico.raw_response as any,
      });

      await this.diagnosticoRepo.save(diagEntity);
      await this.solicitudRepo.save(saved);
    } catch (error) {
      this.logger.error('Error en triage automático', error);
    }

    return this.findById(saved.id);
  }

  async updateStatus(id: string, estado: SolicitudEstado, motivo?: string): Promise<SolicitudServicio> {
    const solicitud = await this.findById(id);
    const transitions: Record<SolicitudEstado, SolicitudEstado[]> = {
      [SolicitudEstado.PENDIENTE]: [SolicitudEstado.COTIZADO, SolicitudEstado.CANCELADO],
      [SolicitudEstado.COTIZADO]: [SolicitudEstado.AGENDADO, SolicitudEstado.CANCELADO],
      [SolicitudEstado.AGENDADO]: [SolicitudEstado.EN_PROCESO, SolicitudEstado.CANCELADO],
      [SolicitudEstado.EN_PROCESO]: [SolicitudEstado.FINALIZADO, SolicitudEstado.CANCELADO],
      [SolicitudEstado.FINALIZADO]: [],
      [SolicitudEstado.CANCELADO]: [],
    };

    const allowed = transitions[solicitud.estado];
    if (!allowed.includes(estado)) {
      throw new BadRequestException(
        `No se puede cambiar de ${solicitud.estado} a ${estado}`,
      );
    }

    solicitud.estado = estado;

    if (estado === SolicitudEstado.EN_PROCESO) {
      solicitud.fecha_inicio = new Date();
    } else if (estado === SolicitudEstado.FINALIZADO) {
      solicitud.fecha_fin = new Date();
    } else if (estado === SolicitudEstado.CANCELADO) {
      solicitud.motivo_cancelacion = motivo || 'Sin motivo especificado';
    }

    return this.solicitudRepo.save(solicitud);
  }

  async assignTechnician(id: string, tecnicoId: string): Promise<SolicitudServicio> {
    const solicitud = await this.findById(id);
    solicitud.tecnico_id = tecnicoId;
    if (solicitud.estado === SolicitudEstado.COTIZADO) {
      solicitud.estado = SolicitudEstado.AGENDADO;
    }
    return this.solicitudRepo.save(solicitud);
  }

  async getStats(): Promise<any> {
    const total = await this.solicitudRepo.count();
    const porEstado = await this.solicitudRepo
      .createQueryBuilder('s')
      .select('s.estado', 'estado')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.estado')
      .getRawMany();

    const tiempoPromedio = await this.solicitudRepo
      .createQueryBuilder('s')
      .select('AVG(EXTRACT(EPOCH FROM (s.fecha_fin - s.fecha_inicio))/60)', 'promedio_min')
      .where('s.estado = :estado', { estado: SolicitudEstado.FINALIZADO })
      .andWhere('s.fecha_inicio IS NOT NULL')
      .andWhere('s.fecha_fin IS NOT NULL')
      .getRawOne();

    return { total, porEstado, tiempoPromedio };
  }
}
