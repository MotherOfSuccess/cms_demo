import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageEntity } from '../../../entities/language.entity';
import { Repository } from 'typeorm';
import { LogService } from '../../log/services/log.service';
import { Levels } from '../../../constants/enums/levels.enum';
import { Methods } from '../../../constants/enums/methods.enum';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    private logService: LogService,
  ) {}
  async findByCode(languageCode: string): Promise<LanguageEntity | null> {
    try {
      const condition = await this.languageRepository
        .createQueryBuilder('language')
        .where('deleted = :deleted', { deleted: false })
        .andWhere('code = :code', { code: languageCode });
      return condition.getOne() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'LanguageService.findByCode()',
        error,
      );
      return null;
    }
  }
}
