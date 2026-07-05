import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';

@Entity('diagnosticos_ia')
export class DiagnosticoIA {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  tipo_falla: string;

  @Column({
    type: 'enum',
    enum: ['baja', 'media', 'alta'],
  })
  urgencia: string;

  @Column('int')
  tiempo_estimado_min: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costo_estimado: number;

  @Column('decimal', { precision: 4, scale: 2 })
  confianza: number;

  @Column('text', { nullable: true })
  recomendaciones: string;

  @Column('jsonb', { nullable: true })
  raw_response: object;

  @Column({ length: 100 })
  modelo_ia: string;

  @Column('int', { nullable: true })
  latencia_ms: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => SolicitudServicio, (sol) => sol.diagnostico)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudServicio;

  @Column()
  solicitud_id: string;
}
