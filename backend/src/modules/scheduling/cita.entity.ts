import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';

export enum CitaEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  EN_CAMINO = 'en_camino',
  EN_PROGRESO = 'en_progreso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column('int')
  duracion_estimada_min: number;

  @Column({
    type: 'enum',
    enum: CitaEstado,
    default: CitaEstado.PENDIENTE,
  })
  estado: CitaEstado;

  @Column({ length: 255, nullable: true })
  direccion_visita: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  ubicacion_lat: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  ubicacion_lng: number;

  @Column('text', { nullable: true })
  notas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => SolicitudServicio)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudServicio;

  @Column()
  solicitud_id: string;
}
