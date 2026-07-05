import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago, PagoEstado, PagoMetodo } from './pago.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Pago)
    private pagoRepo: Repository<Pago>,
  ) {}

  async findBySolicitudId(solicitudId: string): Promise<Pago | null> {
    return this.pagoRepo.findOne({ where: { solicitud_id: solicitudId } });
  }

  async create(dto: {
    solicitud_id: string;
    monto: number;
    metodo: PagoMetodo;
    referencia_pago?: string;
  }): Promise<Pago> {
    const pago = this.pagoRepo.create({
      solicitud_id: dto.solicitud_id,
      monto: dto.monto,
      metodo: dto.metodo,
      estado: PagoEstado.PENDIENTE,
      referencia_pago: dto.referencia_pago,
    });
    return this.pagoRepo.save(pago);
  }

  async confirmPayment(id: string, referencia?: string): Promise<Pago> {
    const pago = await this.pagoRepo.findOne({ where: { id } });
    if (!pago) throw new NotFoundException('Pago no encontrado');

    pago.estado = PagoEstado.COMPLETADO;
    pago.fecha_pago = new Date();
    if (referencia) pago.referencia_pago = referencia;
    return this.pagoRepo.save(pago);
  }

  async getAll(): Promise<Pago[]> {
    return this.pagoRepo.find({
      relations: ['solicitud'],
      order: { created_at: 'DESC' },
    });
  }

  async getTotalIngresos(): Promise<number> {
    const result = await this.pagoRepo
      .createQueryBuilder('pago')
      .select('SUM(pago.monto)', 'total')
      .where('pago.estado = :estado', { estado: PagoEstado.COMPLETADO })
      .getRawOne();
    return result?.total || 0;
  }
}
