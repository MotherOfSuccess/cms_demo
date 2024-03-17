import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { UserEntity } from '../../../entities/user.entity';

import { LogService } from '../../../modules/log/services/log.service';

import { Levels } from '../../../constants/enums/levels.enum';
import { Methods } from '../../../constants/enums/methods.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userReponsitory: Repository<UserEntity>,
    private dataSource: DataSource,
    private logService: LogService,
  ) {}

  async count(input?: string): Promise<any> {
    try {
      const users = await this.userReponsitory
        .createQueryBuilder('users')
        .where('users.deleted = :deleted', { deleted: false });
      if (input && input.length > 0) {
        users.andWhere(`users.username LIKE '%${input}%'`);
      }
      return users.getCount();
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'UserService.count()',
        error,
      );
      return null;
    }
  }

  async findAllWithPagination(
    offset: number,
    limit: number,
    input?: string,
  ): Promise<UserEntity[] | null> {
    try {
      const query = this.userReponsitory
        .createQueryBuilder('users')
        .where('users.deleted = :deleted', { deleted: false });
      if (input && input.length > 0) {
        query.andWhere(`users.username LIKE '%${input}%'`);
      }
      const users = query
        .orderBy('users.createAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();
      return users || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'UserService.findAllWithPagination()',
        error,
      );
      return null;
    }
  }

  async add(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<UserEntity | null> {
    try {
      if (!manager) {
        manager = this.dataSource.manager;
      }
      user = await manager.save(user);
      return user;
    } catch (error) {
      this.logService.writeLog(
        Levels.LOG,
        Methods.INSERT,
        'UserService.addUser()',
        error,
      );
      return null;
    }
  }

  async update(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<UserEntity | null> {
    try {
      if (!manager) manager = this.dataSource.manager;
      user = await manager.save(user);
      return user;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'UserService.update()',
        error,
      );
      return null;
    }
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    try {
      const users = await this.userReponsitory
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.user_permissions', 'user_permissions')
        .innerJoinAndSelect('user_permissions.permission', 'permission')
        .where('users.deleted = :deleted', { deleted: false })
        .andWhere('users.username = :username', { username: username })
        .getOne();
      return users || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'UserService.findUserByUsername()',
        error,
      );
      return null;
    }
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    try {
      const user = this.userReponsitory
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.user_permissions', 'user_permissions')
        .innerJoinAndSelect('user_permissions.permission', 'permission')
        .where('user.deleted = :deleted', { deleted: false })
        .andWhere('user.id = :id', { id: id })
        .getOne();
      return user || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'UserSerice.findUserById()',
        error,
      );
      return null;
    }
  }
}
