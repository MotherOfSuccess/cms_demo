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

  UserModule,
  PermissionModule,
  LogModule,
];

export const controllers = [AppController];

export const providers = [AppService];
