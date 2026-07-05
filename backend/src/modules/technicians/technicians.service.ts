import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tecnico, TecnicoEstado } from './tecnico.entity';

@Injectable()
export class TechniciansService {
  private readonly logger = new Logger(TechniciansService.name);

  constructor(
    @InjectRepository(Tecnico)
    private tecnicoRepo: Repository<Tecnico>,
  ) {}

  async findByUserId(userId: string): Promise<Tecnico> {
    const tecnico = await this.tecnicoRepo.findOne({
      where: { usuario_id: userId },
      relations: ['usuario'],
    });
    if (!tecnico) throw new NotFoundException('Perfil de técnico no encontrado');
    return tecnico;
  }

  async findById(id: string): Promise<Tecnico> {
    const tecnico = await this.tecnicoRepo.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!tecnico) throw new NotFoundException('Técnico no encontrado');
    return tecnico;
  }

  async findAll(): Promise<Tecnico[]> {
    return this.tecnicoRepo.find({ relations: ['usuario'] });
  }

  async findAvailableByZone(zona: string): Promise<Tecnico[]> {
    return this.tecnicoRepo.find({
      where: {
        zona_cobertura: zona,
        estado: TecnicoEstado.DISPONIBLE,
      },
      relations: ['usuario'],
    });
  }

  async updateLocation(id: string, lat: number, lng: number): Promise<Tecnico> {
    const tecnico = await this.findById(id);
    tecnico.ubicacion_lat = lat;
    tecnico.ubicacion_lng = lng;
    tecnico.ultima_ubicacion_actualizada = new Date();
    return this.tecnicoRepo.save(tecnico);
  }

  async updateStatus(id: string, estado: TecnicoEstado): Promise<Tecnico> {
    const tecnico = await this.findById(id);
    tecnico.estado = estado;
    return this.tecnicoRepo.save(tecnico);
  }

  async update(id: string, dto: Partial<Tecnico>): Promise<Tecnico> {
    const tecnico = await this.findById(id);
    Object.assign(tecnico, dto);
    return this.tecnicoRepo.save(tecnico);
  }
}
