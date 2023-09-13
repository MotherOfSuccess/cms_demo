import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';

import { UserService } from '../services/user.service';
import { PermissionService } from '../../../modules/permissions/services/permission/permission.service';
import { UserPermissionService } from '../../../modules/permissions/services/user-permission/user-permission.service';
import { ConfigurationService } from '../../../modules/shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { HandleException } from '../../../exceptions/HandleException';

import {
  addUserWithPermissions,
  unlinkUserandPermission,
  updateUserandPermission,
} from '../functions';

import { Levels } from '../../../constants/enums/levels.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { ErrorMasage } from '../constants/enums/error-message.enum';
import { GetUserDto } from '../dtos/get-user.dto';
import { Configuration } from '../../shared/constants/configuration.enum';

import { generateUserResponse } from '../utils';
import { RoleGuard } from '../../auth/guards/roles.guard';
import { Permissions } from '../../../utils';
import { Roles } from '../../../constants/enums/roles.enum';

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly userPermissionService: UserPermissionService,
    private readonly dataSource: DataSource,
    private readonly configurationService: ConfigurationService,
    private readonly logService: LogService,
  ) {}

  @Post('all')
  @Permissions(Roles.QLND)
  async findAll(@Body() users: GetUserDto, @Req() req: Request) {
    try {
      this.logService.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(users),
      );

      const { page, input } = users;
      let { pages } = users;
      const itemPerPage = parseInt(
        this.configurationService.get(Configuration.ITEMS_PER_PAGE),
      );

      if (pages == 0) {
        const count = await this.userService.count(input);
        if (count > 0) pages = Math.ceil(count / itemPerPage);
      }
      const pagination = await this.userService.findAllWithPagination(
        (page - 1) * itemPerPage,
        itemPerPage,
        input,
      );
      if (pagination && pagination.length > 0) {
        return generateUserResponse(page, pages, pagination);
      } else {
        throw new HandleException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMasage.NO_CONTENT,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  }

  @Post('add')
  @Permissions(Roles.QLND)
  async addUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      this.logService.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(createUserDto),
      );

      const add = await addUserWithPermissions(
        createUserDto,
        this.userService,
        req,
        this.permissionService,
        this.userPermissionService,
        this.dataSource,
        this.configurationService,
      );
      if (add instanceof HttpException) throw add;
      return add;
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

  @Put('update/:username')
  @Permissions(Roles.QLND)
  async updateUser(
    @Param('username') username: string,
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      this.logService.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify(updateUserDto),
      );
      const update = await updateUserandPermission(
        username,
        req,
        updateUserDto,
        this.dataSource,
        this.userService,
        this.permissionService,
        this.userPermissionService,
        this.configurationService,
      );
      if (update instanceof HttpException) throw update;
      return update;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  }

  @Delete(':username')
  @Permissions(Roles.QLND)
  async unlink(@Param('username') username: string, @Req() req: Request) {
    try {
      this.logService.writeLog(
        Levels.LOG,
        req.method,
        req.url,
        JSON.stringify({ username: username }),
      );
      const unlink = unlinkUserandPermission(
        username,
        this.userService,
        this.userPermissionService,
        this.permissionService,
        this.dataSource,
        req,
      );
      if (unlink instanceof HttpException) throw unlink;
      return unlink;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  }
}
