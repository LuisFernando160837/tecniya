import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';

@ApiTags('Notificaciones')
@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notifService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Mis notificaciones' })
  async findMyNotifications(@CurrentUser('sub') userId: string) {
    return this.notifService.findByUserId(userId);
  }

  @Get('no-leidas')
  @ApiOperation({ summary: 'Contar notificaciones no leídas' })
  async getUnreadCount(@CurrentUser('sub') userId: string) {
    const count = await this.notifService.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/leer')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  async markAsRead(@Param('id') id: string) {
    return this.notifService.markAsRead(id);
  }

  @Put('leer-todas')
  @ApiOperation({ summary: 'Marcar todas como leídas' })
  async markAllAsRead(@CurrentUser('sub') userId: string) {
    return this.notifService.markAllAsRead(userId);
  }
}
