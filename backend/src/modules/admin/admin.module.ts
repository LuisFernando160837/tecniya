import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../users/usuario.entity';
import { Cliente } from '../clients/cliente.entity';
import { Tecnico } from '../technicians/tecnico.entity';
import { SolicitudServicio } from '../service-requests/solicitud-servicio.entity';
import { Pago } from '../payments/pago.entity';
import { ZonaCobertura } from '../coverage-zones/zona-cobertura.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Cliente, Tecnico, SolicitudServicio, Pago, ZonaCobertura]),
    JwtAuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
