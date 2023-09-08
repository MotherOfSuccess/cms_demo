import { SessionEntity } from './session.entity';
import { PermissionEntity } from './permission.entity';
import { UserPermissionEntity } from './user-permission.entity';
import { UserEntity } from './user.entity';

export const entities = [
  UserEntity,
  PermissionEntity,
  UserPermissionEntity,
  SessionEntity,
];
