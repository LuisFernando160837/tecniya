import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonaCobertura } from './zona-cobertura.entity';
import { CoverageZonesController } from './coverage-zones.controller';
import { CoverageZonesService } from './coverage-zones.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ZonaCobertura]), JwtAuthModule],
  controllers: [CoverageZonesController],
  providers: [CoverageZonesService],
  exports: [CoverageZonesService],
})
export class CoverageZonesModule {}
