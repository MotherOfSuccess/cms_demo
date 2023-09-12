import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    if (req.user) {
      const payload = req.user as JwtPayload;
      return validateRoles(payload, temp);
    }
    return false;
  }
}
