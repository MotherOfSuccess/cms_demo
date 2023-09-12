import { Roles } from '../../../../constants/enums/roles.enum';

export interface JwtPayload {
  userID: string;
  username: string;
  permissions?: Roles[];
}
