import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  async findByUserId(userId: string): Promise<Cliente> {
    const cliente = await this.clienteRepo.findOne({
      where: { usuario_id: userId },
      relations: ['usuario', 'equipos'],
    });
    if (!cliente) throw new NotFoundException('Perfil de cliente no encontrado');
    return cliente;
  }

  async findById(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
      relations: ['usuario', 'equipos'],
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async update(id: string, dto: Partial<Cliente>): Promise<Cliente> {
    const cliente = await this.findById(id);
    Object.assign(cliente, dto);
    return this.clienteRepo.save(cliente);
  }
}
