import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Cliente } from '../clients/cliente.entity';
import { Tecnico } from '../technicians/tecnico.entity';
import { DiagnosticoIA } from '../triage/diagnostico-ia.entity';
import { Pago } from '../payments/pago.entity';
import { Calificacion } from '../ratings/calificacion.entity';

export enum SolicitudEstado {
  PENDIENTE = 'pendiente',
  COTIZADO = 'cotizado',
  AGENDADO = 'agendado',
  EN_PROCESO = 'en_proceso',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

@Entity('solicitudes_servicio')
export class SolicitudServicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  descripcion_problema: string;

  @Column({ nullable: true })
  foto_problema_url: string;

  @Column({ length: 100, nullable: true })
  tipo_equipo: string;

  @Column({ length: 100, nullable: true })
  marca: string;

  @Column({ length: 200, nullable: true })
  modelo: string;

  @Column({
    type: 'enum',
    enum: SolicitudEstado,
    default: SolicitudEstado.PENDIENTE,
  })
  estado: SolicitudEstado;

  @Column({ length: 100, nullable: true })
  tipo_falla: string;

  @Column({
    type: 'enum',
    enum: ['baja', 'media', 'alta'],
    nullable: true,
  })
  urgencia: string;

  @Column('int', { nullable: true })
  tiempo_estimado_min: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costo_estimado: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costo_final: number;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  confianza_diagnostico: number;

  @Column({ nullable: true })
  fecha_agendada: Date;

  @Column({ nullable: true })
  fecha_inicio: Date;

  @Column({ nullable: true })
  fecha_fin: Date;

  @Column({ nullable: true })
  motivo_cancelacion: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.solicitudes)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column()
  cliente_id: string;

  @ManyToOne(() => Tecnico, (tecnico) => tecnico.solicitudes_asignadas)
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: Tecnico;

  @Column({ nullable: true })
  tecnico_id: string;

  @OneToOne(() => DiagnosticoIA, (diag) => diag.solicitud)
  diagnostico: DiagnosticoIA;

  @OneToOne(() => Pago, (pago) => pago.solicitud)
  pago: Pago;

  @OneToOne(() => Calificacion, (cal) => cal.solicitud)
  calificacion: Calificacion;
}
