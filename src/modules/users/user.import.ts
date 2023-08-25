import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserEntity } from '../../entities/user.entity';
import { SharedModule } from '../shared/shared.module';
import { LogService } from '../log/services/log.service';
import { PermissionService } from '../permissions/services/permission/permission.service';
import { UserPermissionService } from '../permissions/services/user-permission/user-permission.service';
import { PermissionModule } from '../permissions/permission.module';

export const module = [
  TypeOrmModule.forFeature([UserEntity]),
  SharedModule,
  PermissionModule,
];

export const providers = [UserService, LogService];

export const controllers = [UserController];

export const exps = [UserService];
