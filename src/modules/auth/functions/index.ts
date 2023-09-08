import { JwtService } from '@nestjs/jwt';
import { DataSource, QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { Request } from 'express';

import { SessionEntity } from '../../../entities/session.entity';

import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { generateAccessToken, generateTokens } from '../utils/generateToken';

import { HandleException } from '../../../exceptions/HandleException';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { generateResponse } from '../utils';
import { validateToken } from '../validations';
import { Configuration } from '../../shared/constants/configuration.enum';

export const addSessionLogin = async (
  userID: string,
  username: string,
  jwtService: JwtService,
  configurationService: ConfigurationService,
  authService: AuthService,
  dataSource: DataSource,
  req: Request,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    queryRunner.startTransaction();
    const { refreshToken, accessToken } = await generateTokens(
      userID,
      username,
      jwtService,
      configurationService,
    );

    const valid = await validateToken(
      accessToken,
      req,
      jwtService,
      configurationService.get(Configuration.ACCESS_SECRET_KEY),
    );
    if (valid instanceof HttpException) throw HttpException;

    const session = new SessionEntity();
    const now = new Date();

    session.userID = userID;
    session.refreshToken = refreshToken;
    session.accessToken = accessToken;
    session.loginAt = now;
    session.aTExpireAt = new Date(valid.exp * 1000);

    const isExisted = await authService.findSession(userID);
    let temp: SessionEntity | HttpException;
    if (!isExisted) {
      temp = await authService.addSession(session, queryRunner.manager);
    } else {
      session.id = isExisted.id;
      temp = await renew(
        session.refreshToken,
        session,
        authService,
        queryRunner,
        req,
      );
    }
    if (temp instanceof HttpException) throw temp;
    else {
      queryRunner.commitTransaction();
      return generateResponse(temp, username);
    }
  } catch (error) {
    queryRunner.rollbackTransaction();

    if (error instanceof HttpException) throw error;
    throw new HandleException(
      SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
      req.method,
      req.url,
      error,
    );
  }
};

export const renew = async (
  refreshToken: string,
  session: SessionEntity,
  authService: AuthService,
  queryRunner: QueryRunner,
  req: Request,
) => {
  try {
    session.refreshToken = refreshToken;
    session = await authService.updateSession(session, queryRunner.manager);
    return session;
  } catch (error) {
    return new HandleException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      error,
    );
  }
};

export const refreshTheToken = async (
  userID: string,
  username: string,
  refreshToken: string,
  session: SessionEntity,
  authService: AuthService,
  jwtService: JwtService,
  configurationService: ConfigurationService,
  dataSource: DataSource,
  req: Request,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    await queryRunner.startTransaction();
    const new_access_token = generateAccessToken(
      userID,
      username,
      refreshToken,
      jwtService,
      configurationService,
    );

    session.accessToken = await new_access_token;
    const refresh = renew(refreshToken, session, authService, queryRunner, req);

    if (refresh instanceof HttpException) return refresh;
    else {
      queryRunner.commitTransaction();
      const response = generateResponse(session, username);
      return response;
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    if (error instanceof HttpException) return error;
    return new HandleException(
      SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
      req.method,
      req.url,
    );
  }
};

export const logoutAccount = async (
  username: string,
  session: SessionEntity,
  authService: AuthService,
  dataSource: DataSource,
  req: Request,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    session.logoutAt = new Date();
    session.refreshToken = null;
    session.accessToken = null;
    const updateSession = authService.updateSession(
      session,
      queryRunner.manager,
    );
    if (updateSession) {
      return generateResponse(session, username);
    } else {
      return new HandleException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
      );
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();

    return new HandleException(
      SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
      req.method,
      req.url,
      error,
    );
  }
};
