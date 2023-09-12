import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Levels } from '../../../../constants/enums/levels.enum';
import { Methods } from '../../../../constants/enums/methods.enum';

import { UserPermissionEntity } from '../../../../entities/user-permission.entity';
import { LogService } from '../../../log/services/log.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPermissionService {
  constructor(
    private dataSource: DataSource,
    private logService: LogService,
    @InjectRepository(UserPermissionEntity)
    private readonly permissionRepository: Repository<UserPermissionEntity>,
  ) {}

  async bulkAdd(
    userPermission: UserPermissionEntity[],
    manager?: EntityManager,
  ): Promise<UserPermissionEntity[] | null> {
    try {
      if (!manager) {
        manager = this.dataSource.manager;
      }
      userPermission = await manager.save(userPermission);
      return userPermission || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.ADD,
        'UserPermissionService.bulkAdd()',
        error,
      );
      return null;
    }
  }

  async findPermissionsOfUser(
    user_id: string,
  ): Promise<UserPermissionEntity[] | null> {
    try {
      const permissions = this.permissionRepository
        .createQueryBuilder('permissions')
        .where('permissions.deleted = :deleted', { deleted: false })
        .andWhere('permissions.user_id = :user_id', { user_id: user_id });

      return permissions.getMany() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'UserPermissionService.findPermissionOfUser()',
        error,
      );
      return null;
    }
  }

  async bulkUnlink(user_id: string, manager?: EntityManager) {
    try {
      if (!manager) manager = this.dataSource.manager;
      const result = await manager.update(
        UserPermissionEntity,
        { user_id: user_id },
        { deleted: true, deleteAt: new Date() },
      );
      return result.affected > 0;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'UserPermission.bulkUnlink()',
        error,
      );
      return null;
    }
  }
}
