import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Administración')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard con KPIs del sistema' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('tecnicos')
  @ApiOperation({ summary: 'Gestionar técnicos' })
  async getTecnicos() {
    return this.adminService.getTecnicos();
  }

  @Get('clientes')
  @ApiOperation({ summary: 'Gestionar clientes' })
  async getClientes() {
    return this.adminService.getClientes();
  }

  @Get('zonas-cobertura')
  @ApiOperation({ summary: 'Zonas de cobertura' })
  async getZonas() {
    return this.adminService.getZonasCobertura();
  }

  @Put('zonas-cobertura/:id/tarifa')
  @ApiOperation({ summary: 'Actualizar tarifa base de zona' })
  async updateTarifa(@Param('id') id: string, @Body() dto: { tarifa_base: number }) {
    return this.adminService.updateTarifaBase(id, dto.tarifa_base);
  }
}
