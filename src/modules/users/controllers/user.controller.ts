import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HandleException } from '../../../exceptions/HandleException';
import { SERVER_EXIT_CODE } from '../../../constants/enums/errors-code.enum';
import { addUserWithPermissions } from '../functions';
import { PermissionService } from '../../../modules/permissions/services/permission/permission.service';
import { UserPermissionService } from '../../../modules/permissions/services/user-permission/user-permission.service';
import { DataSource } from 'typeorm';
import { ConfigurationService } from '../../../modules/shared/services/configuration/configuration.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
    private userPermissionService: UserPermissionService,
    private dataSource: DataSource,
    private configurationService: ConfigurationService,
  ) {}

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Post('add')
  addUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      return addUserWithPermissions(
        createUserDto,
        this.userService,
        req,
        this.permissionService,
        this.userPermissionService,
        this.dataSource,
        this.configurationService,
      );
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
