import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoIA } from './diagnostico-ia.entity';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 1,
    }),
    TypeOrmModule.forFeature([DiagnosticoIA]),
    JwtAuthModule,
  ],
  controllers: [TriageController],
  providers: [TriageService],
  exports: [TriageService],
})
export class TriageModule {}
