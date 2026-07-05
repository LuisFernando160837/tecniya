import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../users/usuario.entity';

export enum NotificacionCanal {
  APP = 'app',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
}

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column('text')
  mensaje: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ nullable: true })
  fecha_lectura: Date;

  @Column({
    type: 'enum',
    enum: NotificacionCanal,
    default: NotificacionCanal.APP,
  })
  canal: NotificacionCanal;

  @Column({ nullable: true })
  referencia_tipo: string;

  @Column({ nullable: true })
  referencia_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.notificaciones)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: string;
}
