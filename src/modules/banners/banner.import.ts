import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerController } from './controllers/banner.controller';
import { BannerService } from './services/banner.service';
import { BannerEntity } from '../../entities/banner.entity';
import { SharedModule } from '../shared/shared.module';
import { LogService } from '../log/services/log.service';
import { FileModule } from '../files/file.module';
import { LanguageModule } from '../languages/language.module';
import { BannerLanguageService } from './services/banner-language/banner-language.service';
import { BannerLanguageEntity } from '../../entities/banner_language.entity';

export const modules = [
  TypeOrmModule.forFeature([BannerEntity, BannerLanguageEntity]),
  SharedModule,
  FileModule,
  LanguageModule,
];

export const controllers = [BannerController];

export const providers = [BannerService, LogService, BannerLanguageService];

export const exps = [BannerService];
