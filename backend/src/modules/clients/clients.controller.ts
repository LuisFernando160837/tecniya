import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('perfil')
  @ApiOperation({ summary: 'Obtener perfil del cliente autenticado' })
  async getMyProfile(@CurrentUser('sub') userId: string) {
    return this.clientsService.findByUserId(userId);
  }

  @Get(':id')
  @Roles('admin', 'tecnico')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Put('perfil')
  @ApiOperation({ summary: 'Actualizar perfil de cliente' })
  async updateProfile(@CurrentUser('sub') userId: string, @Body() dto: any) {
    const cliente = await this.clientsService.findByUserId(userId);
    return this.clientsService.update(cliente.id, dto);
  }
}
