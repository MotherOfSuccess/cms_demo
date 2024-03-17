import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ConfigurationService } from './modules/shared/services/configuration/configuration.service';

import { postgresqlFactory } from './factories/postgresql.factory';
import { jwtFactory } from './factories/jwt.factory';

import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/users/user.module';
import { LogModule } from './modules/log/log.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { BannerModule } from './modules/banners/banner.module';
import { FileModule } from './modules/files/file.module';

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
  BannerModule,
  FileModule,
];

export const controllers = [AppController];

export const providers = [AppService];
