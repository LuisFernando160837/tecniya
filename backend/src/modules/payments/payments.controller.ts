import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Pagos')
@Controller('pagos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todos los pagos' })
  async getAll() {
    return this.paymentsService.getAll();
  }

  @Get('solicitud/:solicitudId')
  @ApiOperation({ summary: 'Obtener pago por solicitud' })
  async findBySolicitud(@Param('solicitudId') solicitudId: string) {
    return this.paymentsService.findBySolicitudId(solicitudId);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar pago' })
  async create(@Body() dto: any) {
    return this.paymentsService.create(dto);
  }

  @Put(':id/confirmar')
  @Roles('admin')
  @ApiOperation({ summary: 'Confirmar pago' })
  async confirm(@Param('id') id: string, @Body() dto: any) {
    return this.paymentsService.confirmPayment(id, dto.referencia);
  }
}
