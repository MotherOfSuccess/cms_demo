import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../../../../entities/permission.entity';
import { Repository } from 'typeorm';
import { LogService } from '../../../log/services/log.service';
import { Levels } from '../../../../constants/enums/levels.enum';
import { Methods } from '../../../../constants/enums/methods.enum';
import { ErrorMessage } from '../../constants/error-message.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    private logService: LogService,
  ) {}

  async findAllPermissions(): Promise<PermissionEntity[] | null> {
    try {
      const permissions = this.permissionRepository
        .createQueryBuilder('permissions')
        .where('permissions.deleted = :deleted', { deleted: false });
      return permissions.getMany() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'PermissionService.findAllPermissions()',
        error,
      );
      return null;
    }
  }

  async findPermission(codes: string[]): Promise<PermissionEntity[] | null> {
    try {
      if (codes && codes.length > 0) {
        const permissions = this.permissionRepository
          .createQueryBuilder('permission')
          .where('permission.deleted = :deleted', { deleted: false })
          .andWhere('permission.code in (:...codes)', { codes: codes });
        return permissions.getMany() || null;
      } else {
        this.logService.writeLog(
          Levels.LOG,
          Methods.GET,
          'PermissionService.findPermission()',
          ErrorMessage.NO_CONTENT,
        );
        return null;
      }
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'PermissionService.findPermission()',
        error,
      );
      return null;
    }
  }

  async findPermissionById(id: string): Promise<PermissionEntity | null> {
    try {
      const permission = this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.deleted = :deleted', { deleted: false })
        .andWhere('permission.id = :id', { id: id });
      return permission.getOne() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'PermissionService.findPermissionById()',
        error,
      );
      return null;
    }
  }
}
