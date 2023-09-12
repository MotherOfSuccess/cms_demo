import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { LengthValidator } from '../../../validators/length.validator';

import { generateValidationMessage } from '../../../utils';

import { PermissionDto } from './permission.dto';

export class UpdateUserDto {
  @IsOptional()
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @LengthValidator(1, 20, {
    message: (arg) =>
      generateValidationMessage(arg, 'Max length of password is 20 characters'),
  })
  password: string;

  @IsOptional()
  @Transform((params) => params.value ?? true)
  @IsBoolean({
    message: (arg) => generateValidationMessage(arg, 'Status is not available'),
  })
  status: boolean;

  @IsOptional()
  @ArrayNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please choose permissions for this user'),
  })
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permission: PermissionDto[];
}
