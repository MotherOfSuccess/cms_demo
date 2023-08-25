import { Module } from '@nestjs/common';

import { ConfigurationService } from './services/configuration/configuration.service';

@Module({
  providers: [ConfigurationService],

  exports: [ConfigurationService],
})
export class SharedModule {}
