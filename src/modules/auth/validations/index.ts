import * as bcrypt from 'bcrypt';
import { Request } from 'express';

import { UserEntity } from '../../../entities/user.entity';

import { HandleException } from '../../../exceptions/HandleException';

import { UserService } from '../../users/services/user.service';

import {
  AUTHENTICATION_EXIT_CODE,
  DATABASE_EXIT_CODE,
  UNKNOW_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { ErrorMasage } from '../constants/error-message.enum';

import { sprintf } from '../../../utils';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenException } from '../exceptions/InvalidTokenException';
import { ExpiredTokenException } from '../exceptions/ExpiredTokenException';
import { JwtPayload } from '../interfaces/payload/jwt-payload.interface';
import { Roles } from '../../../constants/enums/roles.enum';

export const validateUser = async (
  username: string,
  password: string,
  userService: UserService,
  req: Request,
) => {
  const user = await userService.findUserByUsername(username);
  if (user) {
    const validPass = await validatePassword(user, password);
    if (validPass) {
      return user;
    } else {
      return new HandleException(
        DATABASE_EXIT_CODE.NO_CONTENT,
        req.method,
        req.url,
        ErrorMasage.PASSWORD_NO_MATCH,
      );
    }
  } else {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      sprintf(ErrorMasage.USERNAME_NOT_FOUND, username),
    );
  }
};

export const validatePassword = async (user: UserEntity, password: string) => {
  const valid = await bcrypt.compare(password, user.password);
  return valid;
};

export const validateToken = async (
  token: string,
  req: Request,
  jwtService: JwtService,
  secret: string,
) => {
  try {
    const user = jwtService.verify(token, { secret: secret });
    return user;
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return new ExpiredTokenException(
        token,
        AUTHENTICATION_EXIT_CODE.EXPIRED_TOKEN,
        req.method,
        req.url,
        error,
      );
    return new InvalidTokenException(
      token,
      AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
      req.method,
      req.url,
    );
  }
};

export const validateRoles = async (
  user: JwtPayload,
  roles: Roles[],
  req: Request,
) => {
  let isAccess = false;
  try {
    user.permissions.forEach((e) => {
      console.log(roles.includes(e));
      if (roles.includes(e)) {
        isAccess = true;
      }
    });
    return isAccess;
  } catch (error) {
    return new HandleException(
      UNKNOW_EXIT_CODE.UNKNOW_ERROR,
      req.method,
      req.url,
    );
  }
};
