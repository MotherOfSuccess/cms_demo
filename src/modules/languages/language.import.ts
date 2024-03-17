import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageEntity } from '../../entities/language.entity';
import { LanguageService } from './services/language.service';
import { LogService } from '../log/services/log.service';

export const modules = [TypeOrmModule.forFeature([LanguageEntity])];

export const providers = [LanguageService, LogService];

export const exps = [LanguageService];
