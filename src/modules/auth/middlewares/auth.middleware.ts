import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { HandleException } from '../../../exceptions/HandleException';

import { AUTHENTICATION_EXIT_CODE } from '../../../constants/enums/errors-code.enum';
import { Configuration } from '../../shared/constants/configuration.enum';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { AuthService } from '../services/auth.service';

import { InvalidTokenException } from '../exceptions/InvalidTokenException';
import { ExpiredTokenException } from '../exceptions/ExpiredTokenException';
import { sprintf } from '../../../utils';
import { ErrorMasage } from '../constants/error-message.enum';
import { JwtPayload } from '../interfaces/payload/jwt-payload.interface';

@Injectable()
export class VerifyMiddlewares implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private configurationService: ConfigurationService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = await req.headers['authorization'];
    if (authorization) {
      const accessToken = authorization.split(' ')[1];
      if (accessToken || accessToken.length > 0) {
        try {
          const user = await this.jwtService.verify(accessToken, {
            secret: this.configurationService.get(
              Configuration.ACCESS_SECRET_KEY,
            ),
          });

          req.user = user as JwtPayload;

          const auth = await this.authService.findSession(user.userID);
          if (!auth) {
            throw new InvalidTokenException(
              accessToken,
              AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
              req.method,
              req.url,
            );
          }
          next();
        } catch (error) {
          if (error instanceof HttpException) throw error;
          if (error.name === 'TokenExpiredError')
            throw new ExpiredTokenException(
              accessToken,
              AUTHENTICATION_EXIT_CODE.EXPIRED_TOKEN,
              req.method,
              req.url,
              error.message,
            );
          else
            throw new InvalidTokenException(
              accessToken,
              AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
              req.method,
              req.url,
              sprintf(ErrorMasage.INVALID_TOKEN, 'accessToken', accessToken),
            );
        }
      } else {
        throw new HandleException(
          AUTHENTICATION_EXIT_CODE.NO_TOKEN,
          req.method,
          req.url,
          `No token`,
        );
      }
    } else {
      next();
    }
  }
}
