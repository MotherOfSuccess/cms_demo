import { DataSource, QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { BannerService } from '../services/banner.service';
import { FileService } from '../../files/services/file.service';
import { BannerLanguageService } from '../services/banner-language/banner-language.service';
import { LanguageService } from '../../languages/services/language.service';

import { CreateBannerDto } from '../dtos/create-banner.dto';

import { BannerEntity } from '../../../entities/banner.entity';
import { BannerLanguageEntity } from '../../../entities/banner_language.entity';

import { HandleException } from '../../../exceptions/HandleException';

import { DATABASE_EXIT_CODE } from '../../../constants/enums/errors-code.enum';

import { validateDate, validateFile, validateLanguage } from '../validators';
import { _slugify } from '../../../utils';
import { ErrorMasage } from '../constants/error-message.enum';

export const addBannerWithLanguage = async (
  createBanner: CreateBannerDto,
  bannerService: BannerService,
  fileService: FileService,
  languageService: LanguageService,
  bannerLanguageService: BannerLanguageService,
  dataSource: DataSource,
  req: Request,
) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    await queryRunner.startTransaction();
    const banner = await addBanner(
      createBanner,
      queryRunner,
      bannerService,
      req,
    );
    if (banner instanceof HttpException) throw banner;
    const banner_language = await addBannerLanguage(
      createBanner,
      banner,
      bannerLanguageService,
      languageService,
      fileService,
      queryRunner,
      req,
    );
    if (banner_language instanceof HttpException) throw banner_language;
    await queryRunner.commitTransaction();
    return banner_language;
  } catch (error) {
    console.log('Rollback....');
    await queryRunner.rollbackTransaction();
    if (error instanceof HttpException) return error;
    throw new HandleException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      ErrorMasage.OPERATOR_BANNER_ERROR,
    );
  }
};

export const addBanner = async (
  createBanner: CreateBannerDto,
  queryRunner: QueryRunner,
  bannerService: BannerService,
  req: Request,
) => {
  try {
    const { startAt, endAt, status } = createBanner;
    const valid_date = await validateDate(startAt, endAt, req);

    if (valid_date instanceof HttpException) return valid_date;
    const banner_entity = new BannerEntity();
    banner_entity.startAt = new Date(startAt);
    banner_entity.endAt = new Date(endAt);
    banner_entity.status = status ?? true;

    const banner = await bannerService.add(banner_entity, queryRunner.manager);
    return banner;
  } catch (error) {
    return new HandleException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      ErrorMasage.OPERATOR_BANNER_ERROR,
    );
  }
};

export const addBannerLanguage = async (
  createBanner: CreateBannerDto,
  banner: BannerEntity,
  bannerLanguageService: BannerLanguageService,
  languageService: LanguageService,
  fileService: FileService,
  queryRunner: QueryRunner,
  req: Request,
) => {
  try {
    const { title, fileID, languageCode } = createBanner;

    const valid_file = await validateFile(fileID, fileService, req);
    const valid_language = await validateLanguage(
      languageCode,
      languageService,
      req,
    );

    if (valid_file instanceof HttpException) return valid_file;
    if (valid_language instanceof HttpException) return valid_language;

    const banner_language = new BannerLanguageEntity();
    banner_language.bannerID = banner.id;
    banner_language.title = title;
    banner_language.slug = _slugify(title);
    banner_language.fileID = fileID;
    banner_language.languageCode = languageCode;

    const update_file_drafted = await valid_file;
    update_file_drafted.drafted = true;

    const update_file = await fileService.update(
      update_file_drafted,
      queryRunner.manager,
    );
    if (!update_file)
      return new HandleException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
        ErrorMasage.OPERATOR_BANNER_ERROR,
      );
    const bannerLanguage = await bannerLanguageService.add(
      banner_language,
      queryRunner.manager,
    );
    if (!bannerLanguage)
      return new HandleException(
        DATABASE_EXIT_CODE.OPERATOR_ERROR,
        req.method,
        req.url,
        ErrorMasage.OPERATOR_BANNER_ERROR,
      );
    return bannerLanguage;
  } catch (error) {
    if (error instanceof HttpException) return error;
    return new HandleException(
      DATABASE_EXIT_CODE.OPERATOR_ERROR,
      req.method,
      req.url,
      ErrorMasage.OPERATOR_BANNER_ERROR,
    );
  }
};
