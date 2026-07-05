import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';
import { DiagnosticoIA } from '../triage/diagnostico-ia.entity';
import { Usuario } from '../users/usuario.entity';
import { Cliente } from '../clients/cliente.entity';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { TriageModule } from '../triage/triage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudServicio, DiagnosticoIA, Usuario, Cliente]),
    TriageModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
