import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZonaCobertura } from './zona-cobertura.entity';

@Injectable()
export class CoverageZonesService {
  constructor(
    @InjectRepository(ZonaCobertura)
    private zonaRepo: Repository<ZonaCobertura>,
  ) {}

  async findAll(): Promise<ZonaCobertura[]> {
    return this.zonaRepo.find({ where: { activo: true } });
  }

  async findById(id: string): Promise<ZonaCobertura> {
    const zona = await this.zonaRepo.findOne({ where: { id } });
    if (!zona) throw new NotFoundException('Zona de cobertura no encontrada');
    return zona;
  }

  async findByDistrito(distrito: string): Promise<ZonaCobertura | null> {
    return this.zonaRepo.findOne({
      where: { distrito, activo: true },
    });
  }

  async create(dto: Partial<ZonaCobertura>): Promise<ZonaCobertura> {
    const zona = this.zonaRepo.create(dto);
    return this.zonaRepo.save(zona);
  }

  async update(id: string, dto: Partial<ZonaCobertura>): Promise<ZonaCobertura> {
    const zona = await this.findById(id);
    Object.assign(zona, dto);
    return this.zonaRepo.save(zona);
  }

  async deactivate(id: string): Promise<void> {
    const zona = await this.findById(id);
    zona.activo = false;
    await this.zonaRepo.save(zona);
  }
}
