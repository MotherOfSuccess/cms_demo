import { JwtModule, JwtService } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigurationService } from '../shared/services/configuration/configuration.service';
import { LogService } from '../log/services/log.service';

import { SessionEntity } from '../../entities/session.entity';

import { jwtFactory } from '../../factories/jwt.factory';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

export const controllers = [AuthController];

export const providers = [AuthService, LogService, JwtStrategy];

export const modules = [
  TypeOrmModule.forFeature([SessionEntity]),
  JwtModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: jwtFactory,
  }),
  SharedModule,
  PassportModule,
  UserModule,
];

export const exps = [AuthService];
