import { Injectable } from '@nestjs/common';
import { Levels } from 'src/constants/enums/levels.enum';
import { Methods } from 'src/constants/enums/methods.enum';
import { UserPermissionEntity } from 'src/entities/user-permission.entity';
import { LogService } from 'src/modules/log/services/log.service';
import { DataSource, EntityManager } from 'typeorm';

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
