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
import { Equipo } from '../equipment/equipo.entity';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';
import { Calificacion } from '../ratings/calificacion.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  direccion: string;

  @Column({ length: 100, nullable: true })
  distrito: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitud: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitud: number;

  @Column({ length: 50, nullable: true })
  referencia_direccion: string;

  @Column({ default: 0 })
  puntos_fidelidad: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Usuario, (usuario) => usuario.cliente)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: string;

  @OneToMany(() => Equipo, (equipo) => equipo.cliente)
  equipos: Equipo[];

  @OneToMany(() => SolicitudServicio, (sol) => sol.cliente)
  solicitudes: SolicitudServicio[];

  @OneToMany(() => Calificacion, (cal) => cal.cliente)
  calificaciones: Calificacion[];
}
