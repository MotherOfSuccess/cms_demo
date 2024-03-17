import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerLanguageEntity } from '../../../../entities/banner_language.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { LogService } from '../../../log/services/log.service';
import { Levels } from '../../../../constants/enums/levels.enum';
import { Methods } from '../../../../constants/enums/methods.enum';

@Injectable()
export class BannerLanguageService {
  constructor(
    @InjectRepository(BannerLanguageEntity)
    private bannerRepository: Repository<BannerLanguageEntity>,
    private dataSource: DataSource,
    private logService: LogService,
  ) {}

  async add(
    bannerLanguage: BannerLanguageEntity,
    manager?: EntityManager,
  ): Promise<BannerLanguageEntity | null> {
    try {
      if (!manager) manager = this.dataSource.manager;
      bannerLanguage = await manager.save(bannerLanguage);
      return bannerLanguage;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'BannerLanguageService.add()',
        error,
      );
      return null;
    }
  }
}
