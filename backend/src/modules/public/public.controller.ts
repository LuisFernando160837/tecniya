import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('Público')
@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Post('solicitudes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear solicitud de servicio (sin autenticación)' })
  async crearSolicitud(@Body() dto: {
    nombre: string;
    telefono: string;
    email?: string;
    direccion: string;
    distrito: string;
    descripcion_problema: string;
    tipo_equipo?: string;
    marca?: string;
    modelo?: string;
    referencia_direccion?: string;
  }) {
    return this.publicService.crearSolicitud(dto);
  }

  @Get('solicitudes/:id')
  @ApiOperation({ summary: 'Consultar estado de solicitud por ID' })
  async consultarEstado(@Param('id') id: string) {
    const result = await this.publicService.consultarEstado(id);
    if (!result) return { error: 'Solicitud no encontrada' };
    return result;
  }
}
