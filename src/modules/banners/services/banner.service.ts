import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';

import { Methods } from '../../../constants/enums/methods.enum';
import { Levels } from '../../../constants/enums/levels.enum';

import { LogService } from '../../log/services/log.service';

import { BannerEntity } from '../../../entities/banner.entity';
import { LANGUAGE_DEFAULT } from '../../../constants';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private bannerRepository: Repository<BannerEntity>,
    private dataSource: DataSource,
    private logService: LogService,
  ) {}

  async count(input?: string): Promise<number> {
    try {
      const condition = this.bannerRepository
        .createQueryBuilder('banner')
        .where('banner.deleted = :deleted', { deleted: false });
      if (input && input.length > 0) {
        condition.andWhere(`banner.slug LIKE '%${input}%'`);
      }
      return condition.getCount();
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'BannerService.count()',
        error,
      );
      return 0;
    }
  }

  async findAllBanner(
    offset: number,
    limit: number,
    input?: string,
  ): Promise<BannerEntity[] | null> {
    try {
      const condition = this.bannerRepository
        .createQueryBuilder('banner')
        .innerJoinAndSelect(
          'banner.banner_languages',
          'banner_languages',
          `banner_languages.deleted = :deleted
          AND banner_languages.bannerID = banner.id
          AND banner_languages.languageCode = :languageCode`,
          { deleted: false, languageCode: LANGUAGE_DEFAULT },
        )
        .innerJoinAndSelect('banner_languages.file', 'file')
        .innerJoinAndSelect('banner_languages.language', 'language')
        .where('banner.deleted = :deleted', { deleted: false });
      if (input && input.length > 0)
        condition.andWhere(`banner.slug LIKE '%${input}%'`);
      const banners = await condition
        .orderBy('banner.createAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();
      return banners || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'BannerService.getAllBanner()',
        error,
      );
      return null;
    }
  }

  async add(
    banner: BannerEntity,
    manager?: EntityManager,
  ): Promise<BannerEntity | null> {
    try {
      if (!manager) manager = this.dataSource.manager;
      banner = await manager.save(banner);
      return banner || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'BannerService.add()',
        error,
      );
      return null;
    }
  }
}
