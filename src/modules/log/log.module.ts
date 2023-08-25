import { Module } from '@nestjs/common';
import { exps, providers } from './log.imports';

@Module({
  providers: providers,
  exports: exps,
})
export class LogModule {}
