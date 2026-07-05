import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion, NotificacionCanal } from './notificacion.entity';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notificacion)
    private notifRepo: Repository<Notificacion>,
  ) {}

  async create(dto: {
    usuario_id: string;
    titulo: string;
    mensaje: string;
    canal?: NotificacionCanal;
    referencia_tipo?: string;
    referencia_id?: string;
  }): Promise<Notificacion> {
    const notif = this.notifRepo.create({
      usuario_id: dto.usuario_id,
      titulo: dto.titulo,
      mensaje: dto.mensaje,
      canal: dto.canal || NotificacionCanal.APP,
      referencia_tipo: dto.referencia_tipo,
      referencia_id: dto.referencia_id,
    });

    const saved = await this.notifRepo.save(notif);

    if (dto.canal === NotificacionCanal.WHATSAPP) {
      this.sendWhatsApp(dto.usuario_id, dto.mensaje).catch((err) =>
        this.logger.error('Error enviando WhatsApp', err),
      );
    }

    return saved;
  }

  async findByUserId(usuarioId: string): Promise<Notificacion[]> {
    return this.notifRepo.find({
      where: { usuario_id: usuarioId },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(id: string): Promise<Notificacion | null> {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) return null;
    notif.leida = true;
    notif.fecha_lectura = new Date();
    return this.notifRepo.save(notif);
  }

  async markAllAsRead(usuarioId: string): Promise<void> {
    await this.notifRepo.update(
      { usuario_id: usuarioId, leida: false },
      { leida: true, fecha_lectura: new Date() },
    );
  }

  async getUnreadCount(usuarioId: string): Promise<number> {
    return this.notifRepo.count({
      where: { usuario_id: usuarioId, leida: false },
    });
  }

  private async sendWhatsApp(userId: string, message: string): Promise<void> {
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    if (!webhookUrl) {
      this.logger.warn('WHATSAPP_WEBHOOK_URL no configurado, simulando envío');
      this.logger.log(`[WhatsApp Simulado] Para usuario ${userId}: ${message}`);
      return;
    }

    try {
      await axios.post(webhookUrl, {
        to: userId,
        message,
        type: 'text',
      });
    } catch (error) {
      this.logger.error(`Error enviando WhatsApp a ${userId}`, error);
    }
  }
}
