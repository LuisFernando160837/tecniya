import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EquipmentService } from './equipment.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Equipos')
@Controller('equipos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EquipmentController {
  constructor(private equipService: EquipmentService) {}

  @Get()
  @ApiOperation({ summary: 'Listar equipos del cliente autenticado' })
  async findByClient(@CurrentUser('sub') userId: string) {
    return this.equipService.findByClientId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener equipo por ID' })
  async findOne(@Param('id') id: string) {
    return this.equipService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo equipo' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: any,
  ) {
    return this.equipService.create({ ...dto, cliente_id: userId });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar equipo' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.equipService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar equipo' })
  async remove(@Param('id') id: string) {
    return this.equipService.remove(id);
  }
}
