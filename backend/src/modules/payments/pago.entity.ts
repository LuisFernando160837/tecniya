import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';

export enum PagoEstado {
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
  RECHAZADO = 'rechazado',
  REEMBOLSADO = 'reembolsado',
}

export enum PagoMetodo {
  EFECTIVO = 'efectivo',
  YAPE = 'yape',
  PLIN = 'plin',
  TRANSFERENCIA = 'transferencia',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({
    type: 'enum',
    enum: PagoEstado,
    default: PagoEstado.PENDIENTE,
  })
  estado: PagoEstado;

  @Column({
    type: 'enum',
    enum: PagoMetodo,
  })
  metodo: PagoMetodo;

  @Column({ nullable: true })
  referencia_pago: string;

  @Column({ nullable: true })
  comprobante_url: string;

  @Column({ nullable: true })
  fecha_pago: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => SolicitudServicio, (sol) => sol.pago)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudServicio;

  @Column()
  solicitud_id: string;
}
