import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../../../../entities/permission.entity';
import { Repository } from 'typeorm';
import { LogService } from '../../../log/services/log.service';
import { Levels } from '../../../../constants/enums/levels.enum';
import { Methods } from '../../../../constants/enums/methods.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    private logService: LogService,
  ) {}

  async findPermission(codes?: string[]): Promise<PermissionEntity[] | null> {
    try {
      let permissions = this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.deleted = :deleted', { deleted: false });
      if (codes && codes.length > 0) {
        permissions = permissions.andWhere('permission.code in (:...codes)', {
          codes: codes,
        });
      }

      return permissions.getMany() || null;
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

  // async add(createPermissionDto: CreatePermissionDto) {}
}
