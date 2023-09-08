import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import e, { Request } from 'express';

import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { UserService } from '../../users/services/user.service';

import { addSessionLogin, logoutAccount, refreshTheToken } from '../functions';

import { sprintf } from '../../../utils';

import { HandleException } from '../../../exceptions/HandleException';
import { InvalidTokenException } from '../exceptions/InvalidTokenException';

import {
  AUTHENTICATION_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { Configuration } from '../../shared/constants/configuration.enum';
import { ErrorMasage } from '../constants/error-message.enum';

import { RenewTokenDto } from '../dtos/renew.dto';
import { LoginDto } from '../dtos/login.dto';

import { validateToken, validateUser } from '../validations';
import { LogoutGuard } from '../guards/jwt.guard';
import { JwtPayload } from '../interfaces/payload/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
    private configurationService: ConfigurationService,
    private dataSource: DataSource,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    try {
      const { username, password } = await loginDto;
      const user = await validateUser(
        username,
        password,
        this.userService,
        req,
      );
      if (user instanceof HttpException) throw user;
      else {
        const addSession = await addSessionLogin(
          user.id,
          user.username,
          this.jwtService,
          this.configurationService,
          this.authService,
          this.dataSource,
          req,
        );
        if (addSession instanceof HttpException) throw addSession;
        else {
          return addSession;
        }
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
        error,
      );
    }
  }

  @Post('renew')
  async renewToken(@Body() refresh: RenewTokenDto, @Req() req: Request) {
    try {
      const refreshToken = refresh.refreshToken;
      const user = await validateToken(
        refreshToken,
        req,
        this.jwtService,
        this.configurationService.get(Configuration.REFRESH_SECRET_KEY),
      );

      if (user instanceof HttpException) throw user;
      else {
        const session = await this.authService.isValid(refreshToken);
        if (session) {
          const renewal = refreshTheToken(
            user.userID,
            user.username,
            refreshToken,
            session,
            this.authService,
            this.jwtService,
            this.configurationService,
            this.dataSource,
            req,
          );
          if (renewal instanceof HttpException) throw renewal;
          else return renewal;
        } else {
          throw new InvalidTokenException(
            refreshToken,
            AUTHENTICATION_EXIT_CODE.INVALID_TOKEN,
            req.method,
            req.url,
            sprintf(ErrorMasage.INVALID_TOKEN, 'refreshToken', refreshToken),
          );
        }
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else {
        throw new HandleException(
          SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
          req.method,
          req.url,
          error,
        );
      }
    }
  }

  @Get('logout')
  @UseGuards(LogoutGuard)
  async logout(@Req() req: Request) {
    try {
      const temp = req.user as JwtPayload;
      if (temp) {
        const session = await this.authService.findSession(temp.userID);
        const logout = await logoutAccount(
          temp.username,
          session,
          this.authService,
          this.dataSource,
          req,
        );
        if (logout instanceof HttpException) throw logout;
        else return logout;
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
        error,
      );
    }
  }
}
