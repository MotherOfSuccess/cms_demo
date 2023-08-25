import { Module } from '@nestjs/common';
import { module, providers, controllers, exps } from './user.import';

@Module({
  imports: module,

  providers: providers,

  controllers: controllers,

  exports: exps,
})
export class UserModule {}
