import { SessionEntity } from './session.entity';
import { PermissionEntity } from './permission.entity';
import { UserPermissionEntity } from './user-permission.entity';
import { UserEntity } from './user.entity';
import { LanguageEntity } from './language.entity';
import { BannerEntity } from './banner.entity';
import { BannerLanguageEntity } from './banner_language.entity';
import { FileEntity } from './file.entity';

export const entities = [
  UserEntity,
  PermissionEntity,
  UserPermissionEntity,
  SessionEntity,
  LanguageEntity,
  BannerEntity,
  BannerLanguageEntity,
  FileEntity,
];
