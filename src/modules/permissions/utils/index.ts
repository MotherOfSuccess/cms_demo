import { PermissionEntity } from '../../../entities/permission.entity';

import { PermissionResponse } from '../interfaces/permission-response.interface';

import { returnObject } from '../../../utils';

export const generatePermissionResponse = (permissions: PermissionEntity[]) => {
  const payload: PermissionResponse[] = [];
  for (const pms of permissions) {
    const item: PermissionResponse = {
      id: pms.id,
      name: pms.name,
      code: pms.code,
    };
    payload.push(item);
  }
  return returnObject<PermissionResponse>(payload);
};
