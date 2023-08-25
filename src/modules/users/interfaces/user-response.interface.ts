import { PermissionResponse } from '../../../modules/permissions/interfaces/permission-response.interface';

export interface UserResponse {
  id: string;
  username: string;
  status: boolean;
  permissions: PermissionResponse[] | null;
}
