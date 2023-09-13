import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { PermissionService } from '../services/permission/permission.service';
import { LogService } from '../../../modules/log/services/log.service';

import { Levels } from '../../../constants/enums/levels.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { ErrorMessage } from '../constants/error-message.enum';

import { generatePermissionResponse } from '../utils';

import { HandleException } from '../../../exceptions/HandleException';
import { Roles } from '../../../constants/enums/roles.enum';
import { Permissions } from '../../../utils';
import { RoleGuard } from '../../auth/guards/roles.guard';

@Controller('permission')
@UseGuards(RoleGuard)
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private logService: LogService,
  ) {}

  @Get()
  @Permissions(Roles.QLTT, Roles.QLTC)
  async getPermissions(@Req() req: Request) {
    try {
      this.logService.writeLog(Levels.LOG, req.method, req.url, null);

      const permissions = await this.permissionService.findAllPermissions();
      if (permissions && permissions.length > 0) {
        const response = await generatePermissionResponse(permissions);
        return response;
      } else {
        throw new HandleException(
          DATABASE_EXIT_CODE.UNKNOW_VALUE,
          req.method,
          req.url,
          ErrorMessage.NO_CONTENT,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else {
        throw new HandleException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
        );
      }
    }
  }
}
