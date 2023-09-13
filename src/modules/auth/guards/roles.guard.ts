import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../../../constants/enums/roles.enum';
import { validateRoles } from '../validations';
import { JwtPayload } from '../interfaces/payload/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const temp = this.reflector.get<Roles[]>('roles', context.getHandler());

    const req = context.switchToHttp().getRequest();

    console.log(temp);
    if (req.user) {
      const payload = req.user as JwtPayload;
      const valid = await validateRoles(payload, temp, req);
      if (valid instanceof HttpException) return false;
      return valid;
    }
    return false;
  }
}
