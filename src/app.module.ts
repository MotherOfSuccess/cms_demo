import { Module } from '@nestjs/common';

import { module, controllers, providers } from './app.imports';

@Module({
  imports: module,

  controllers: controllers,

  providers: providers,
})
export class AppModule {}
