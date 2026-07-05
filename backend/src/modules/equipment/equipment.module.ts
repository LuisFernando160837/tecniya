import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './equipo.entity';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo]), JwtAuthModule],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService],
})
export class EquipmentModule {}
