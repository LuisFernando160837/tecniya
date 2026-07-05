import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UserRole } from '../users/usuario.entity';
import { Cliente } from '../clients/cliente.entity';
import { Tecnico, TecnicoEstado } from '../technicians/tecnico.entity';
import { SolicitudServicio, SolicitudEstado } from '../service-requests/solicitud-servicio.entity';
import { Pago, PagoEstado } from '../payments/pago.entity';
import { ZonaCobertura } from '../coverage-zones/zona-cobertura.entity';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    @InjectRepository(Tecnico)
    private tecnicoRepo: Repository<Tecnico>,
    @InjectRepository(SolicitudServicio)
    private solicitudRepo: Repository<SolicitudServicio>,
    @InjectRepository(Pago)
    private pagoRepo: Repository<Pago>,
    @InjectRepository(ZonaCobertura)
    private zonaRepo: Repository<ZonaCobertura>,
  ) {}

  async getDashboard() {
    const [
      totalUsuarios,
      totalClientes,
      totalTecnicos,
      solicitudesPorEstado,
      ingresos,
      tiempoPromedio,
      tecnicosDisponibles,
    ] = await Promise.all([
      this.usuarioRepo.count({ where: { activo: true } }),
      this.clienteRepo.count(),
      this.tecnicoRepo.count(),
      this.getSolicitudesPorEstado(),
      this.getIngresos(),
      this.getTiempoPromedioAtencion(),
      this.tecnicoRepo.count({ where: { estado: TecnicoEstado.DISPONIBLE } }),
    ]);

    return {
      resumen: {
        total_usuarios: totalUsuarios,
        total_clientes: totalClientes,
        total_tecnicos: totalTecnicos,
        tecnicos_disponibles: tecnicosDisponibles,
        ingresos_totales: ingresos,
        tiempo_promedio_atencion_min: tiempoPromedio,
      },
      solicitudes_por_estado: solicitudesPorEstado,
    };
  }

  private async getSolicitudesPorEstado() {
    const raw = await this.solicitudRepo
      .createQueryBuilder('s')
      .select('s.estado', 'estado')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.estado')
      .getRawMany();
    return raw.map((r) => ({ estado: r.estado, count: parseInt(r.count) }));
  }

  private async getIngresos(): Promise<number> {
    const result = await this.pagoRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.monto), 0)', 'total')
      .where('p.estado = :estado', { estado: PagoEstado.COMPLETADO })
      .getRawOne();
    return parseFloat(result?.total || '0');
  }

  private async getTiempoPromedioAtencion(): Promise<number> {
    const result = await this.solicitudRepo
      .createQueryBuilder('s')
      .select(
        "AVG(EXTRACT(EPOCH FROM (s.fecha_fin - s.fecha_inicio)) / 60)",
        'promedio',
      )
      .where('s.estado = :estado', { estado: SolicitudEstado.FINALIZADO })
      .andWhere('s.fecha_inicio IS NOT NULL')
      .andWhere('s.fecha_fin IS NOT NULL')
      .getRawOne();
    return parseFloat(result?.promedio || '0');
  }

  async getTecnicos() {
    return this.tecnicoRepo.find({ relations: ['usuario'] });
  }

  async getClientes() {
    return this.clienteRepo.find({ relations: ['usuario'] });
  }

  async getZonasCobertura() {
    return this.zonaRepo.find();
  }

  async updateTarifaBase(zonaId: string, tarifa: number) {
    await this.zonaRepo.update(zonaId, { tarifa_base: tarifa });
    return this.zonaRepo.findOne({ where: { id: zonaId } });
  }
}
