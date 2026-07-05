import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Cliente } from '../clients/cliente.entity';
import { Tecnico } from '../technicians/tecnico.entity';
import { Notificacion } from '../notifications/notificacion.entity';

export enum UserRole {
  CLIENTE = 'cliente',
  TECNICO = 'tecnico',
  ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 100 })
  nombre_completo: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  rol: UserRole;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  refresh_token_hash: string;

  @Column({ nullable: true })
  ultimo_acceso: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Cliente, (cliente) => cliente.usuario)
  cliente: Cliente;

  @OneToOne(() => Tecnico, (tecnico) => tecnico.usuario)
  tecnico: Tecnico;

  @OneToMany(() => Notificacion, (notif) => notif.usuario)
  notificaciones: Notificacion[];
}
