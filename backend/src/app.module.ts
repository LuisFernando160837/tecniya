import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { TriageModule } from './modules/triage/triage.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { CoverageZonesModule } from './modules/coverage-zones/coverage-zones.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { PublicModule } from './modules/public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'tecniya'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: true,
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    TechniciansModule,
    EquipmentModule,
    ServiceRequestsModule,
    TriageModule,
    SchedulingModule,
    TrackingModule,
    PaymentsModule,
    RatingsModule,
    CoverageZonesModule,
    NotificationsModule,
    AdminModule,
    PublicModule,
  ],
})
export class AppModule {}
