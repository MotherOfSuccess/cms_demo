import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { FileEntity } from '../../entities/file.entity';

import { FileController } from './controllers/file.controller';

import { FileService } from './services/file.service';
import { LogService } from '../log/services/log.service';
import { ConfigurationService } from '../shared/services/configuration/configuration.service';

import { multerFactory } from '../../factories/multerFactory';

import { SharedModule } from '../shared/shared.module';

export const modules = [
  TypeOrmModule.forFeature([FileEntity]),
  MulterModule.registerAsync({
    imports: [SharedModule],
    inject: [ConfigurationService],
    useFactory: multerFactory,
  }),
];

export const controllers = [FileController];

export const providers = [FileService, LogService];

export const exps = [FileService];
