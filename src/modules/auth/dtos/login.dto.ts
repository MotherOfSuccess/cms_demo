import { IsNotEmpty } from 'class-validator';
import { generateValidationMessage } from '../../../utils';
import { Transform } from 'class-transformer';
import { LengthValidator } from '../../../validators/length.validator';

export class LoginDto {
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
}
