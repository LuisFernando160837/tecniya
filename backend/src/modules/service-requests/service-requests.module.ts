import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudServicio } from './solicitud-servicio.entity';
import { DiagnosticoIA } from '../triage/diagnostico-ia.entity';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { TriageModule } from '../triage/triage.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudServicio, DiagnosticoIA]),
    JwtAuthModule,
    TriageModule,
    NotificationsModule,
  ],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService],
})
export class ServiceRequestsModule {}
