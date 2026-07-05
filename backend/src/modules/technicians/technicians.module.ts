import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tecnico } from './tecnico.entity';
import { TechniciansController } from './technicians.controller';
import { TechniciansService } from './technicians.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tecnico]), JwtAuthModule],
  controllers: [TechniciansController],
  providers: [TechniciansService],
  exports: [TechniciansService],
})
export class TechniciansModule {}
