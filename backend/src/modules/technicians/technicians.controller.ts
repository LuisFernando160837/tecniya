import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TechniciansService } from './technicians.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { Roles } from '../../common/roles.decorator';
import { TecnicoEstado } from './tecnico.entity';

@ApiTags('Técnicos')
@Controller('tecnicos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TechniciansController {
  constructor(private techService: TechniciansService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todos los técnicos' })
  async findAll() {
    return this.techService.findAll();
  }

  @Get('perfil')
  @ApiOperation({ summary: 'Obtener perfil del técnico autenticado' })
  async getMyProfile(@CurrentUser('sub') userId: string) {
    return this.techService.findByUserId(userId);
  }

  @Get('disponibles/:zona')
  @ApiOperation({ summary: 'Buscar técnicos disponibles por zona' })
  async findAvailable(@Param('zona') zona: string) {
    return this.techService.findAvailableByZone(zona);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener técnico por ID' })
  async findOne(@Param('id') id: string) {
    return this.techService.findById(id);
  }

  @Put('ubicacion')
  @Roles('tecnico')
  @ApiOperation({ summary: 'Actualizar ubicación del técnico' })
  async updateLocation(
    @CurrentUser('sub') userId: string,
    @Body() dto: { lat: number; lng: number },
  ) {
    const tecnico = await this.techService.findByUserId(userId);
    return this.techService.updateLocation(tecnico.id, dto.lat, dto.lng);
  }

  @Put('estado')
  @Roles('tecnico')
  @ApiOperation({ summary: 'Actualizar estado del técnico' })
  async updateStatus(
    @CurrentUser('sub') userId: string,
    @Body() dto: { estado: TecnicoEstado },
  ) {
    const tecnico = await this.techService.findByUserId(userId);
    return this.techService.updateStatus(tecnico.id, dto.estado);
  }
}
