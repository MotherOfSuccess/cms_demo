import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission/permission.service';
import { PermissionEntity } from '../../entities/permission.entity';
import { LogService } from '../log/services/log.service';

export const modules = [TypeOrmModule.forFeature([PermissionEntity])];

export const controllers = [PermissionController];

export const providers = [PermissionService, LogService];

export const exps = [PermissionService];
