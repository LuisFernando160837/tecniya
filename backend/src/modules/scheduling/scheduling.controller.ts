import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Agendamiento')
@Controller('citas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SchedulingController {
  constructor(private scheduleService: SchedulingService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear cita para una solicitud' })
  async create(@Body() dto: any) {
    return this.scheduleService.create(dto);
  }

  @Get('solicitud/:solicitudId')
  @ApiOperation({ summary: 'Obtener cita por solicitud' })
  async findBySolicitud(@Param('solicitudId') solicitudId: string) {
    return this.scheduleService.findBySolicitudId(solicitudId);
  }

  @Put(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de cita' })
  async updateStatus(@Param('id') id: string, @Body() dto: any) {
    return this.scheduleService.updateStatus(id, dto.estado);
  }
}
