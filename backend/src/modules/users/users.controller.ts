import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Desactivar usuario' })
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
