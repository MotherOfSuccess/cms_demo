import { Body, Controller, HttpException, Post, Req } from '@nestjs/common';

import { HandleException } from '../../../exceptions/HandleException';

import {
  DATABASE_EXIT_CODE,
  SERVER_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { Configuration } from '../../shared/constants/configuration.enum';

import { BannerService } from '../services/banner.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { generateResponseBanner } from '../utils';

import { GetBannerDto } from '../dtos/get-banner.dto';
import { ErrorMasage } from '../constants/error-message.enum';
import { CreateBannerDto } from '../dtos/create-banner.dto';
import { addBannerWithLanguage } from '../functions';
import { DataSource } from 'typeorm';
import { BannerLanguageService } from '../services/banner-language/banner-language.service';
import { FileService } from '../../files/services/file.service';
import { LanguageService } from '../../languages/services/language.service';

@Controller('banner')
export class BannerController {
  constructor(
    private bannerService: BannerService,
    private fileService: FileService,
    private languageService: LanguageService,
    private bannerLanguageService: BannerLanguageService,
    private configurationService: ConfigurationService,
    private dataSource: DataSource,
  ) {}

  @Post()
  async getAll(@Body() getBanner: GetBannerDto, @Req() req: Request) {
    try {
      const { page, input } = getBanner;
      let { pages } = getBanner;
      const itemPerPage = parseInt(
        this.configurationService.get(Configuration.ITEMS_PER_PAGE),
      );
      if (pages == 0) {
        const count = await this.bannerService.count(input);
        if (count > 0) pages = Math.ceil(itemPerPage / count);
      }
      const banners = await this.bannerService.findAllBanner(
        (page - 1) * itemPerPage,
        itemPerPage,
        input,
      );
      if (banners && banners.length > 0) {
        return generateResponseBanner(pages, page, banners);
      } else {
        throw new HandleException(
          DATABASE_EXIT_CODE.NO_CONTENT,
          req.method,
          req.url,
          ErrorMasage.BANNER_NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  }

  @Post('add')
  async add(@Body() createBanner: CreateBannerDto, @Req() req: Request) {
    try {
      const banner = await addBannerWithLanguage(
        createBanner,
        this.bannerService,
        this.fileService,
        this.languageService,
        this.bannerLanguageService,
        this.dataSource,
        req,
      );
      if (banner instanceof HttpException) throw banner;
      return banner;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
      );
    }
  }
}
