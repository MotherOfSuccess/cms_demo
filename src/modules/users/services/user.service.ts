import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ConfigurationService } from '../../../modules/shared/services/configuration/configuration.service';
import { LogService } from '../../../modules/log/services/log.service';
import { Levels } from '../../../constants/enums/levels.enum';
import { Methods } from '../../../constants/enums/methods.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userReponsitory: Repository<UserEntity>,
    private configurationService: ConfigurationService,
    private dataSource: DataSource,
    private logService: LogService,
  ) {}

  async findAll(): Promise<UserEntity[] | null> {
    try {
      const users = this.userReponsitory
        .createQueryBuilder('users')
        .where('users.deleted = :deleted', { deleted: false });

      return users.getMany() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'UserService.findAll()',
        error,
      );
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

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    try {
      const users = await this.userReponsitory
        .createQueryBuilder('users')
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
}
