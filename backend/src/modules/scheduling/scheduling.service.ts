import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita, CitaEstado } from './cita.entity';
import { SolicitudServicio, SolicitudEstado } from '../service-requests/solicitud-servicio.entity';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    @InjectRepository(Cita)
    private citaRepo: Repository<Cita>,
  ) {}

  async findBySolicitudId(solicitudId: string): Promise<Cita | null> {
    return this.citaRepo.findOne({ where: { solicitud_id: solicitudId } });
  }

  async create(dto: {
    solicitud_id: string;
    fecha_hora: Date;
    duracion_estimada_min: number;
    direccion_visita?: string;
    ubicacion_lat?: number;
    ubicacion_lng?: number;
  }): Promise<Cita> {
    const existing = await this.findBySolicitudId(dto.solicitud_id);
    if (existing) {
      throw new BadRequestException('Esta solicitud ya tiene una cita agendada');
    }

    const cita = this.citaRepo.create(dto);
    return this.citaRepo.save(cita);
  }

  async updateStatus(id: string, estado: CitaEstado): Promise<Cita> {
    const cita = await this.citaRepo.findOne({ where: { id } });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    cita.estado = estado;
    return this.citaRepo.save(cita);
  }

  async getUpcomingByTecnico(tecnicoId: string): Promise<Cita[]> {
    return this.citaRepo
      .createQueryBuilder('cita')
      .innerJoinAndSelect('cita.solicitud', 'solicitud')
      .where('solicitud.tecnico_id = :tecnicoId', { tecnicoId })
      .andWhere('cita.fecha_hora >= :now', { now: new Date() })
      .andWhere('cita.estado NOT IN (:...estados)', {
        estados: [CitaEstado.COMPLETADA, CitaEstado.CANCELADA],
      })
      .orderBy('cita.fecha_hora', 'ASC')
      .getMany();
  }
}
