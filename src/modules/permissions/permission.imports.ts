import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission/permission.service';
import { PermissionEntity } from '../../entities/permission.entity';
import { LogService } from '../log/services/log.service';
import { UserPermissionService } from './services/user-permission/user-permission.service';
import { UserPermissionEntity } from '../../entities/user-permission.entity';

export const modules = [
  TypeOrmModule.forFeature([PermissionEntity, UserPermissionEntity]),
];

export const controllers = [PermissionController];

export const providers = [PermissionService, LogService, UserPermissionService];

export const exps = [PermissionService, UserPermissionService];
