import { DataSource, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

import { PermissionService } from '../../../modules/permissions/services/permission/permission.service';
import { ConfigurationService } from '../../../modules/shared/services/configuration/configuration.service';
import { UserPermissionService } from '../../../modules/permissions/services/user-permission/user-permission.service';
import { UserService } from '../services/user.service';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { Configuration } from '../../../modules/shared/constants/configuration.enum';
import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { ErrorMasage } from '../constants/enums/error-message.enum';

import { HandleException } from '../../../exceptions/HandleException';

import { sprintf } from '../../../utils';
import { generateSuccessResponse, getCodePermissions } from '../utils';

import { UserEntity } from '../../../entities/user.entity';
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

    if (user instanceof HttpException) throw user;
    else {
      const permissions = await setPermissionUser(
        user,
        createUser,
        permissionService,
        userPermissionService,
        queryRunner,
        req,
      );
      if (permissions instanceof HttpException) throw permissions;
      else {
        const response = generateSuccessResponse(
          user,
          queryRunner,
          permissions,
          permissionService,
        );
        return response;
      }
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (error instanceof HttpException) throw error;
    else {
      return new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
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
    const a = new HandleException(
      DATABASE_EXIT_CODE.UNIQUE_FIELD_VALUE,
      req.method,
      req.url,
      sprintf(ErrorMasage.UNIQUE_USERNAME_ERROR, createUser.username),
    );
    return a;
  }
};

export const setPermissionUser = async (
  user: UserEntity,
  userDto: CreateUserDto | UpdateUserDto,
  permissionService: PermissionService,
  userPermissionService: UserPermissionService,
  queryRunner: QueryRunner,
  req: Request,
) => {
  const permissions = userDto.permission;
  const codes = await getCodePermissions(permissions);
  const permission_detail = await permissionService.findPermission(codes);
  const arrayUserPermission: UserPermissionEntity[] = [];

  if (permission_detail && permission_detail.length > 0) {
    try {
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
    } catch (error) {
      return new HandleException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        sprintf(ErrorMasage.OPERATOR_USER_PERMISSIONS_ERROR),
      );
    }
  }
  return null;
};

export const updateUserandPermission = async (
  username: string,
  req: Request,
  updateUser: UpdateUserDto,
  dataSource: DataSource,
  userService: UserService,
  permissionService: PermissionService,
  userPermissionService: UserPermissionService,
  configurationService: ConfigurationService,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();
    const user = await userService.findUserByUsername(username);
    if (user) {
      const user_setted = await setUser(
        user.id,
        updateUser,
        userService,
        queryRunner,
        req,
        configurationService,
      );
      if (user_setted instanceof HttpException) throw user_setted;
      else {
        const permission_setted = await updatePermission(
          user_setted,
          updateUser,
          userPermissionService,
          permissionService,
          req,
          queryRunner,
        );
        if (permission_setted instanceof HttpException) throw permission_setted;
        else {
          return generateSuccessResponse(
            user_setted,
            queryRunner,
            permission_setted,
            permissionService,
          );
        }
      }
    } else {
      return new HandleException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMasage.USER_NOT_FOUND,
      );
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (error instanceof HttpException) throw error;
    return new HandleException(
      SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
      req.method,
      req.url,
      error,
    );
  }
};

export const setUser = async (
  id: string,
  userDto: UpdateUserDto,
  userService: UserService,
  queryRunner: QueryRunner,
  req: Request,
  configurationService: ConfigurationService,
) => {
  const { password, status } = userDto;
  let user = await userService.findUsernameById(id);
  if (user) {
    if (password) {
      const hash = await bcrypt.hash(
        userDto.password,
        configurationService.get(Configuration.SALT),
      );
      user.password = hash;
    }
    user.updateAt = new Date();
    user.status = status;

    user = await userService.update(user, queryRunner.manager);

    return user;
  } else {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      ErrorMasage.USER_NOT_FOUND,
    );
  }
};

export const updatePermission = async (
  user: UserEntity,
  updateDto: UpdateUserDto,
  userPermissionService: UserPermissionService,
  permissionService: PermissionService,
  req: Request,
  queryRunner: QueryRunner,
) => {
  const unlink = await userPermissionService.bulkUnlink(
    user.id,
    queryRunner.manager,
  );
  if (unlink) {
    const permission = setPermissionUser(
      user,
      updateDto,
      permissionService,
      userPermissionService,
      queryRunner,
      req,
    );

    return permission;
  } else {
    return new HandleException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
    );
  }
};

export const unlinkUserandPermission = async (
  username: string,
  userService: UserService,
  userPermissionService: UserPermissionService,
  permissionService: PermissionService,
  dataSource: DataSource,
  req: Request,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();
    const user_deleted = await unlinkUser(
      username,
      userService,
      queryRunner,
      req,
    );
    if (user_deleted instanceof HttpException) throw user_deleted;
    else {
      const permission_deleted = await unlinkPermission(
        username,
        userService,
        userPermissionService,
        queryRunner,
        req,
      );
      if (permission_deleted instanceof HttpException) throw permission_deleted;

      return generateSuccessResponse(
        user_deleted,
        queryRunner,
        permission_deleted,
        permissionService,
      );
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (error instanceof HttpException) throw error;
    throw new HandleException(
      SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
      req.method,
      req.url,
      error,
    );
  }
};

export const unlinkUser = async (
  username: string,
  userService: UserService,
  queryRunner: QueryRunner,
  req: Request,
) => {
  const user = await userService.findUserByUsername(username);
  if (user) {
    user.deleteAt = new Date();
    user.deleted = true;
    const user_deleted = userService.update(user, queryRunner.manager);
    return user_deleted;
  } else {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      sprintf(ErrorMasage.USER_NOT_FOUND, username),
    );
  }
};

export const unlinkPermission = async (
  username: string,
  userService: UserService,
  userPermissionService: UserPermissionService,
  queryRunner: QueryRunner,
  req: Request,
) => {
  const user = await userService.findUserByUsername(username);
  if (user) {
    const permission_deleted = userPermissionService.bulkUnlink(
      user.id,
      queryRunner.manager,
    );
    if (permission_deleted) {
      return user.user_permissions;
    } else {
      return new HandleException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
        ErrorMasage.OPERATOR_USER_PERMISSIONS_ERROR,
      );
    }
  } else {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      sprintf(ErrorMasage.USER_NOT_FOUND, username),
    );
  }
};
