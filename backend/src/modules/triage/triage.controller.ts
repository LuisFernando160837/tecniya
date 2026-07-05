import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TriageService } from './triage.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';

@ApiTags('Triage IA')
@Controller('triage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TriageController {
  constructor(private triageService: TriageService) {}

  @Post('analizar')
  @ApiOperation({
    summary: 'Analizar descripción de falla con IA local (Ollama)',
    description: 'Envía la descripción del problema y recibe diagnóstico estructurado',
  })
  async analizar(@Body() dto: { descripcion: string; solicitud_id?: string }) {
    return this.triageService.analizar(
      dto.solicitud_id || 'temp',
      dto.descripcion,
    );
  }
}
