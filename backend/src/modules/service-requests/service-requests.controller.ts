import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { Roles } from '../../common/roles.decorator';
import { SolicitudEstado } from './solicitud-servicio.entity';

@ApiTags('Solicitudes de Servicio')
@Controller('solicitudes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServiceRequestsController {
  constructor(private srService: ServiceRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes con filtros' })
  async findAll(
    @Query('cliente_id') cliente_id?: string,
    @Query('tecnico_id') tecnico_id?: string,
    @Query('estado') estado?: SolicitudEstado,
  ) {
    const filters: any = {};
    if (cliente_id) filters.cliente_id = cliente_id;
    if (tecnico_id) filters.tecnico_id = tecnico_id;
    if (estado) filters.estado = estado;
    return this.srService.findAll(filters);
  }

  @Get('mis-solicitudes')
  @ApiOperation({ summary: 'Mis solicitudes como cliente' })
  async findMyRequests(@CurrentUser('sub') userId: string) {
    return this.srService.findAll({ cliente_id: userId });
  }

  @Get('mis-asignaciones')
  @Roles('tecnico')
  @ApiOperation({ summary: 'Mis asignaciones como técnico' })
  async findMyAssignments(@CurrentUser('sub') userId: string) {
    return this.srService.findAll({ tecnico_id: userId });
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Estadísticas de solicitudes' })
  async getStats() {
    return this.srService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener solicitud por ID' })
  async findOne(@Param('id') id: string) {
    return this.srService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva solicitud con triage automático' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: { descripcion_problema: string; foto_problema_url?: string },
  ) {
    return this.srService.create({
      cliente_id: userId,
      ...dto,
    });
  }

  @Put(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de la solicitud' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: { estado: SolicitudEstado; motivo?: string },
  ) {
    return this.srService.updateStatus(id, dto.estado, dto.motivo);
  }

  @Put(':id/asignar')
  @Roles('admin')
  @ApiOperation({ summary: 'Asignar técnico a solicitud' })
  async assignTechnician(
    @Param('id') id: string,
    @Body() dto: { tecnico_id: string },
  ) {
    return this.srService.assignTechnician(id, dto.tecnico_id);
  }
}
