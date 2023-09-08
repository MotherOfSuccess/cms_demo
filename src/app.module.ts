import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { module, controllers, providers } from './app.imports';
import { applyMiddlewares } from './utils';

@Module({
  imports: module,

  controllers: controllers,

  providers: providers,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyMiddlewares(consumer);
  }
}
