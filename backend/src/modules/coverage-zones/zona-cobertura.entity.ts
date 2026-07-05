import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('zonas_cobertura')
export class ZonaCobertura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  distrito: string;

  @Column({ length: 100, nullable: true })
  provincia: string;

  @Column({ length: 100, nullable: true })
  departamento: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitud_centro: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitud_centro: number;

  @Column('int', { nullable: true })
  radio_km: number;

  @Column('jsonb', { nullable: true })
  poligono_geo: object;

  @Column({ default: true })
  activo: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  tarifa_base: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costo_desplazamiento: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
