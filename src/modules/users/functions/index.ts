import { PermissionService } from '../../../modules/permissions/services/permission/permission.service';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DataSource, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigurationService } from '../../../modules/shared/services/configuration/configuration.service';
import { Configuration } from '../../../modules/shared/constants/configuration.enum';
import { HandleException } from '../../../exceptions/HandleException';
import { DATABASE_EXIT_CODE } from '../../../constants/enums/errors-code.enum';
import { ErrorMasage } from '../constants/enums/error-message.enum';
import { sprintf } from '../../../utils';
import { HttpException } from '@nestjs/common';
import { UserEntity } from '../../../entities/user.entity';
import { UserPermissionService } from '../../../modules/permissions/services/user-permission/user-permission.service';
import { getCodePermissions } from '../utils';
import { UserPermissionEntity } from '../../../entities/user-permission.entity';

export const addUserWithPermissions = async (
  createUser: CreateUserDto,
  userService: UserService,
  req: Request,
  permissionService: PermissionService,
  userPermissionService: UserPermissionService,
  dataSource: DataSource,
  configurationService: ConfigurationService,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    await queryRunner.startTransaction();
    const user = await addUser(
      createUser,
      userService,
      queryRunner,
      configurationService,
      req,
    );
    console.log('khoa', user);

    if (user instanceof HttpException) throw user;
    else {
      const permission = await setPermissionUser(
        user,
        createUser,
        permissionService,
        userPermissionService,
        queryRunner,
        req,
      );
      if (permission instanceof HttpException) throw permission;
      else {
        return permission;
      }
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
  }
};

export const addUser = async (
  createUser: CreateUserDto,
  userService: UserService,
  queryRunner: QueryRunner,
  configurationService: ConfigurationService,
  req: Request,
) => {
  let user = await userService.findUserByUsername(createUser.username);

  if (!user) {
    console.log(1);
    const hash = await bcrypt.hash(
      createUser.password,
      parseInt(configurationService.get(Configuration.SALT)),
    );

    const temp = new UserEntity();
    temp.username = createUser.username;
    temp.password = hash;
    temp.status = createUser.status;

    user = await userService.add(temp, queryRunner.manager);
    return user;
  } else {
    console.log(2);
    const a = new HandleException(
      DATABASE_EXIT_CODE.UNIQUE_FIELD_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMasage.UNIQUE_USERNAME_ERROR, createUser.username),
    );
    console.log(a);
    return a;
  }
};

export const setPermissionUser = async (
  user: UserEntity,
  createUser: CreateUserDto,
  permissionService: PermissionService,
  userPermissionService: UserPermissionService,
  queryRunner: QueryRunner,
  req: Request,
) => {
  const permissions = createUser.permission;
  const codes = await getCodePermissions(permissions);
  const permission_detail = await permissionService.findPermission(codes);
  const arrayUserPermission: UserPermissionEntity[] = [];
  if (permission_detail && permission_detail.length > 0) {
    for (const item of permission_detail) {
      const temp = new UserPermissionEntity();
      temp.permission_id = item.id;
      temp.user_id = user.id;

      arrayUserPermission.push(temp);
    }

    const user_permission = await userPermissionService.bulkAdd(
      arrayUserPermission,
      queryRunner.manager,
    );

    return user_permission;
  } else {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      ErrorMasage.PERMISSION_NOT_FOUND,
    );
  }
};
