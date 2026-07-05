import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../clients/cliente.entity';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  tipo: string;

  @Column({ length: 100 })
  marca: string;

  @Column({ length: 200 })
  modelo: string;

  @Column({ length: 100, nullable: true })
  numero_serie: string;

  @Column('text', { nullable: true })
  especificaciones: string;

  @Column({ nullable: true })
  foto_url: string;

  @Column({ nullable: true })
  foto_encrypted: string;

  @Column('text', { nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.equipos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column()
  cliente_id: string;
}
