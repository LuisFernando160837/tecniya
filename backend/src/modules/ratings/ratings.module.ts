import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './calificacion.entity';
import { Tecnico } from '../technicians/tecnico.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacion, Tecnico]), JwtAuthModule],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
