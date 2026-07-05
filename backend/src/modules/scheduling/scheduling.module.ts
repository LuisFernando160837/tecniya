import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './cita.entity';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cita]), JwtAuthModule],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
