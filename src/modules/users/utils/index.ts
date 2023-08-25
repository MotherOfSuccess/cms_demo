import { PermissionDto } from '../dtos/permission.dto';

export const getCodePermissions = (permissions: PermissionDto[]) => {
  return permissions.map((pms) => pms.code);
};
