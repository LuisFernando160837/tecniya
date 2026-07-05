import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { Roles } from '../../common/roles.decorator';

@ApiTags('Calificaciones')
@Controller('calificaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @Roles('cliente')
  @ApiOperation({ summary: 'Calificar servicio' })
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: { solicitud_id: string; tecnico_id: string; puntaje: number; comentario?: string },
  ) {
    return this.ratingsService.create({
      cliente_id: userId,
      ...dto,
    });
  }

  @Get('tecnico/:tecnicoId')
  @ApiOperation({ summary: 'Calificaciones de un técnico' })
  async findByTecnico(@Param('tecnicoId') tecnicoId: string) {
    return this.ratingsService.findByTecnicoId(tecnicoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener calificación por ID' })
  async findOne(@Param('id') id: string) {
    return this.ratingsService.findById(id);
  }
}
