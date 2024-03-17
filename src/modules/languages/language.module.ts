import { Module } from '@nestjs/common';
import { exps, modules, providers } from './language.import';

@Module({
  imports: modules,
  providers: providers,
  exports: exps,
})
export class LanguageModule {}
