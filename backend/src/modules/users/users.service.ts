import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find({ where: { activo: true } });
  }

  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async update(id: string, dto: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.findById(id);
    Object.assign(usuario, dto);
    return this.usuarioRepo.save(usuario);
  }

  async deactivate(id: string): Promise<void> {
    const usuario = await this.findById(id);
    usuario.activo = false;
    await this.usuarioRepo.save(usuario);
  }
}
