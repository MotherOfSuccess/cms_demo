import { Module } from '@nestjs/common';
import { controllers, exps, modules, providers } from './auth.import';

@Module({
  imports: modules,
  providers: providers,
  controllers: controllers,
  exports: exps,
})
export class AuthModule {}
