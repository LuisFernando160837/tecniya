import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../users/usuario.entity';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';

export enum TecnicoEstado {
  DISPONIBLE = 'disponible',
  OCUPADO = 'ocupado',
  DESCONECTADO = 'desconectado',
}

@Entity('tecnicos')
export class Tecnico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  especialidad: string;

  @Column({ length: 100 })
  zona_cobertura: string;

  @Column({
    type: 'enum',
    enum: TecnicoEstado,
    default: TecnicoEstado.DESCONECTADO,
  })
  estado: TecnicoEstado;

  @Column('decimal', { precision: 4, scale: 2, default: 5.0 })
  calificacion_promedio: number;

  @Column({ default: 0 })
  total_servicios: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  ubicacion_lat: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  ubicacion_lng: number;

  @Column({ nullable: true })
  ultima_ubicacion_actualizada: Date;

  @Column({ length: 20, nullable: true })
  documento_identidad: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Usuario, (usuario) => usuario.tecnico)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: string;

  @OneToMany(() => SolicitudServicio, (sol) => sol.tecnico)
  solicitudes_asignadas: SolicitudServicio[];
}
