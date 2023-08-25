import { Module } from '@nestjs/common';
import { controllers, exps, modules, providers } from './permission.imports';
import { UserPermissionService } from './services/user-permission/user-permission.service';

@Module({
  imports: modules,
  controllers: controllers,
  providers: providers,
  exports: exps,
})
export class PermissionModule {}
