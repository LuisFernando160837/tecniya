import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from '../users/usuario.entity';
import { JwtAuthModule } from '../../common/jwt-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtAuthModule],
})
export class AuthModule {}
