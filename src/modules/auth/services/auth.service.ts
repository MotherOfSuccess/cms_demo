import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { SessionEntity } from '../../../entities/session.entity';

import { Methods } from '../../../constants/enums/methods.enum';
import { Levels } from '../../../constants/enums/levels.enum';

import { LogService } from '../../log/services/log.service';

@Injectable()
export class AuthService {
  constructor(
    private logService: LogService,
    @InjectRepository(SessionEntity)
    private authRepository: Repository<SessionEntity>,
    private dataSource: DataSource,
  ) {}

  async findSession(userID: string): Promise<SessionEntity | null> {
    try {
      const sessions = this.authRepository
        .createQueryBuilder('session')
        .where('session.deleted = :deleted', { deleted: false })
        .andWhere('session.userID = :userID', {
          userID: userID,
        });

      return sessions.getOne() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'AuthService.findSession()',
        error,
      );
      return null;
    }
  }

  async addSession(
    session: SessionEntity,
    manager?: EntityManager,
  ): Promise<SessionEntity | null> {
    try {
      if (!manager) {
        manager = this.dataSource.manager;
      }
      session = await manager.save(session);
      return session;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'AuthService.addSession()',
        error,
      );
      return null;
    }
  }

  async updateSession(
    session: SessionEntity,
    manager?: EntityManager,
  ): Promise<SessionEntity | null> {
    try {
      if (!manager) manager = await this.dataSource.manager;
      session.updateAt = new Date();
      session = await manager.save(session);
      return session;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'AuthService.updateSession()',
        error,
      );
      return null;
    }
  }

  async isValid(refreshToken: string) {
    try {
      const session = this.authRepository
        .createQueryBuilder('session')
        .where('session.deleted = :deleted', { deleted: false })
        .andWhere('session.refreshToken = :refreshToken', {
          refreshToken: refreshToken,
        });
      return session.getOne() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'AuthService.isValid()',
        error,
      );
      return null;
    }
  }
}
