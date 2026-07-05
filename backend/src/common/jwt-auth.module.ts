import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'tecniya-jwt-secret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION', '15m'),
        },
      }),
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class JwtAuthModule {}
