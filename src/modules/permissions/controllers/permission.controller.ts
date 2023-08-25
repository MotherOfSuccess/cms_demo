import { Controller, Get, HttpException, Req } from '@nestjs/common';
import { PermissionService } from '../services/permission/permission.service';
import { LogService } from '../../../modules/log/services/log.service';
import { Levels } from '../../../constants/enums/levels.enum';
import { generatePermissionResponse } from '../utils';
import { HandleException } from '../../../exceptions/HandleException';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { ErrorMessage } from '../constants/error-message.enum';

@Controller('permission')
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private logService: LogService,
  ) {}

  @Get()
  async getPermissions(@Req() req: Request) {
    try {
      this.logService.writeLog(Levels.LOG, req.method, req.url, null);
      const permissions = await this.permissionService.findPermission();
      if (permissions && permissions.length > 0) {
        return generatePermissionResponse(permissions);
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
