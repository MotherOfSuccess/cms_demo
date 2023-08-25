import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Levels } from '../../../../constants/enums/levels.enum';
import { Methods } from '../../../../constants/enums/methods.enum';

import { UserPermissionEntity } from '../../../../entities/user-permission.entity';
import { LogService } from '../../../log/services/log.service';

@Injectable()
export class UserPermissionService {
  constructor(private dataSource: DataSource, private logService: LogService) {}

  async bulkAdd(
    userPermission: UserPermissionEntity[],
    manager: EntityManager,
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
}
