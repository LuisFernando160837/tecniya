import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CoverageZonesService } from './coverage-zones.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Zonas de Cobertura')
@Controller('zonas-cobertura')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CoverageZonesController {
  constructor(private zonesService: CoverageZonesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar zonas de cobertura activas' })
  async findAll() {
    return this.zonesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener zona por ID' })
  async findOne(@Param('id') id: string) {
    return this.zonesService.findById(id);
  }

  @Get('distrito/:distrito')
  @ApiOperation({ summary: 'Buscar zona por distrito' })
  async findByDistrito(@Param('distrito') distrito: string) {
    return this.zonesService.findByDistrito(distrito);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear zona de cobertura' })
  async create(@Body() dto: any) {
    return this.zonesService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar zona de cobertura' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.zonesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Desactivar zona de cobertura' })
  async deactivate(@Param('id') id: string) {
    return this.zonesService.deactivate(id);
  }
}
