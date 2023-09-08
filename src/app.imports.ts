import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresqlFactory } from './factories/postgresql.factory';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';
import { UserModule } from './modules/users/user.module';
import { LogModule } from './modules/log/log.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtFactory } from './factories/jwt.factory';

export const module = [
  SharedModule,

  ConfigModule.forRoot({
    isGlobal: true,
  }),

  TypeOrmModule.forRootAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: postgresqlFactory,
  }),

  JwtModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: jwtFactory,
  }),

  LogModule,
  UserModule,
  PermissionModule,
  AuthModule,
];

export const controllers = [AppController];

export const providers = [AppService];
