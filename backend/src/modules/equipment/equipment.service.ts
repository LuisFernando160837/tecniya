import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './equipo.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepo: Repository<Equipo>,
  ) {}

  async findByClientId(clienteId: string): Promise<Equipo[]> {
    return this.equipoRepo.find({
      where: { cliente_id: clienteId },
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Equipo> {
    const equipo = await this.equipoRepo.findOne({ where: { id } });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');
    return equipo;
  }

  async create(dto: {
    cliente_id: string;
    tipo: string;
    marca: string;
    modelo: string;
    numero_serie?: string;
    especificaciones?: string;
    observaciones?: string;
  }): Promise<Equipo> {
    const equipo = this.equipoRepo.create(dto);
    return this.equipoRepo.save(equipo);
  }

  async update(id: string, dto: Partial<Equipo>): Promise<Equipo> {
    const equipo = await this.findById(id);
    Object.assign(equipo, dto);
    return this.equipoRepo.save(equipo);
  }

  async remove(id: string): Promise<void> {
    const equipo = await this.findById(id);
    await this.equipoRepo.remove(equipo);
  }
}
