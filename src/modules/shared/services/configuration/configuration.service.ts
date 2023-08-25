import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  private configService: ConfigService;

  get(name: string): string {
    console.log(name, ': ', process.env[name] || this.configService.get(name));
    return process.env[name] || this.configService.get(name);
  }
}
