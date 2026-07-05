import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, UserRole } from '../users/usuario.entity';
import { Cliente } from '../clients/cliente.entity';
import { Tecnico } from '../technicians/tecnico.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(dto: {
    email: string;
    password: string;
    nombre_completo: string;
    telefono?: string;
    rol: UserRole;
    direccion?: string;
    distrito?: string;
    especialidad?: string;
    zona_cobertura?: string;
    documento_identidad?: string;
  }) {
    const existing = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const password_hash = await bcrypt.hash(dto.password, 12);

    const usuario = this.usuarioRepo.create({
      email: dto.email,
      password_hash,
      nombre_completo: dto.nombre_completo,
      telefono: dto.telefono,
      rol: dto.rol,
    });

    const queryRunner = this.usuarioRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedUser = await queryRunner.manager.save(usuario);

      if (dto.rol === UserRole.CLIENTE) {
        const cliente = queryRunner.manager.create(Cliente, {
          usuario_id: savedUser.id,
          direccion: dto.direccion || '',
          distrito: dto.distrito || '',
        });
        await queryRunner.manager.save(cliente);
      } else if (dto.rol === UserRole.TECNICO) {
        const tecnico = queryRunner.manager.create(Tecnico, {
          usuario_id: savedUser.id,
          especialidad: dto.especialidad || 'general',
          zona_cobertura: dto.zona_cobertura || '',
          documento_identidad: dto.documento_identidad,
        });
        await queryRunner.manager.save(tecnico);
      }

      await queryRunner.commitTransaction();
      return this.generateTokens(savedUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error en registro', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(email: string, password: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email, activo: true },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    usuario.ultimo_acceso = new Date();
    await this.usuarioRepo.save(usuario);

    return this.generateTokens(usuario);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET + '-refresh',
      });

      const usuario = await this.usuarioRepo.findOne({
        where: { id: payload.sub, activo: true },
      });

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens(usuario);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async getProfile(userId: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { id: userId },
      relations: ['cliente', 'tecnico'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password_hash, refresh_token_hash, ...profile } = usuario;
    return profile;
  }

  private generateTokens(usuario: Usuario) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre_completo,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET + '-refresh',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre_completo,
        rol: usuario.rol,
      },
    };
  }
}
