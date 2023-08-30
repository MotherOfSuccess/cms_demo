import { QueryRunner } from 'typeorm';
import { PermissionDto } from '../dtos/permission.dto';
import { UserEntity } from '../../../entities/user.entity';
import { UserResponse } from '../interfaces/user-response.interface';
import { UserPermissionEntity } from '../../../entities/user-permission.entity';
import { PermissionResponse } from '../../permissions/interfaces/permission-response.interface';
import { PermissionService } from '../../permissions/services/permission/permission.service';
import { returnObject, returnObjectWithPagination } from '../../../utils';

export const getCodePermissions = (permissions: PermissionDto[]) => {
  if (permissions?.length) return permissions.map((pms) => pms.code);
  return null;
};

export const generateSuccessResponse = async (
  user: UserEntity,
  queryRunner: QueryRunner,
  permissions: UserPermissionEntity[],
  permissionService: PermissionService,
) => {
  const user_response: UserResponse = {
    id: user.id,
    username: user.username,
    status: user.status,
    createAt: user.createAt,
    updateAt: user.updateAt,
    permissions: [],
  };

  if (queryRunner) await queryRunner.commitTransaction();

  const permission_responses: PermissionResponse[] = [];
  if (permissions && permissions.length > 0) {
    for (const pms of permissions) {
      const permission = await permissionService.findPermissionById(
        pms.permission_id,
      );
      if (permission) {
        const permission_response: PermissionResponse = {
          id: permission.id,
          name: permission.name,
          code: permission.code,
        };
        await permission_responses.push(permission_response);
      }
    }
    user_response.permissions = await permission_responses;
    return returnObject<UserResponse>(user_response, null, null, null);
  }
  return null;
};

export const generateUserResponse = async (
  page: number,
  pages: number,
  user: UserEntity[],
) => {
  const payload: UserResponse[] = [];
  for (const item of user) {
    const temp: UserResponse = {
      id: item.id,
      username: item.username,
      status: item.status,
      createAt: item.createAt,
      updateAt: item.updateAt,
    };
    payload.push(temp);
  }
  return returnObjectWithPagination<UserResponse>(page, pages, payload);
};
