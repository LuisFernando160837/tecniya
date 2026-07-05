import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Cliente } from '../clients/cliente.entity';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';
import { Tecnico } from '../technicians/tecnico.entity';

@Entity('calificaciones')
export class Calificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  puntaje: number;

  @Column('text', { nullable: true })
  comentario: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.calificaciones)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column()
  cliente_id: string;

  @OneToOne(() => SolicitudServicio, (sol) => sol.calificacion)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: SolicitudServicio;

  @Column()
  solicitud_id: string;

  @ManyToOne(() => Tecnico)
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: Tecnico;

  @Column()
  tecnico_id: string;
}
