import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { Tecnico } from '../technicians/tecnico.entity';

@Injectable()
export class RatingsService {
  private readonly logger = new Logger(RatingsService.name);

  constructor(
    @InjectRepository(Calificacion)
    private calificacionRepo: Repository<Calificacion>,
    @InjectRepository(Tecnico)
    private tecnicoRepo: Repository<Tecnico>,
  ) {}

  async create(dto: {
    cliente_id: string;
    solicitud_id: string;
    tecnico_id: string;
    puntaje: number;
    comentario?: string;
  }): Promise<Calificacion> {
    if (dto.puntaje < 1 || dto.puntaje > 5) {
      throw new BadRequestException('El puntaje debe estar entre 1 y 5');
    }

    const existing = await this.calificacionRepo.findOne({
      where: { solicitud_id: dto.solicitud_id },
    });
    if (existing) {
      throw new BadRequestException('Esta solicitud ya tiene una calificación');
    }

    const calificacion = this.calificacionRepo.create(dto);
    const saved = await this.calificacionRepo.save(calificacion);

    await this.updateTecnicoAverage(dto.tecnico_id);

    return saved;
  }

  async findByTecnicoId(tecnicoId: string): Promise<Calificacion[]> {
    return this.calificacionRepo.find({
      where: { tecnico_id: tecnicoId },
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Calificacion> {
    const cal = await this.calificacionRepo.findOne({ where: { id } });
    if (!cal) throw new NotFoundException('Calificación no encontrada');
    return cal;
  }

  private async updateTecnicoAverage(tecnicoId: string): Promise<void> {
    const result = await this.calificacionRepo
      .createQueryBuilder('cal')
      .select('AVG(cal.puntaje)', 'promedio')
      .addSelect('COUNT(*)', 'total')
      .where('cal.tecnico_id = :tecnicoId', { tecnicoId })
      .getRawOne();

    if (result) {
      await this.tecnicoRepo.update(tecnicoId, {
        calificacion_promedio: parseFloat(result.promedio) || 5.0,
        total_servicios: parseInt(result.total) || 0,
      });
    }
  }
}
