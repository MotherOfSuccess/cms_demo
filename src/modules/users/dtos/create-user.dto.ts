import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { generateValidationMessage } from '../../../utils';
import { LengthValidator } from '../../../validators/length.validator';
import { PermissionDto } from './permission.dto';

export class CreateUserDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter your username'),
  })
  @LengthValidator(1, 20, {
    message: (arg) =>
      generateValidationMessage(arg, 'Max length of username is 20 characters'),
  })
  username: string;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter your password'),
  })
  @LengthValidator(1, 20, {
    message: (arg) =>
      generateValidationMessage(arg, 'Max length of password is 20 characters'),
  })
  password: string;

  @IsOptional()
  @IsBoolean({
    message: (arg) => generateValidationMessage(arg, 'Status is not available'),
  })
  status: boolean;

  @IsOptional()
  @ArrayNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please choose permissions for this user'),
  })
  permission: PermissionDto[];
}
