import { Module } from '@nestjs/common';

import { controllers, exps, modules, providers } from './banner.import';
import { BannerLanguageService } from './services/banner-language/banner-language.service';

@Module({
  imports: modules,
  providers: providers,
  controllers: controllers,
  exports: exps,
})
export class BannerModule {}
