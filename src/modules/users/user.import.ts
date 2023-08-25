import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserEntity } from '../../entities/user.entity';
import { SharedModule } from '../shared/shared.module';
import { LogService } from '../log/services/log.service';

export const module = [TypeOrmModule.forFeature([UserEntity]), SharedModule];

export const providers = [UserService, LogService];

export const controllers = [UserController];

export const exps = [UserService];
