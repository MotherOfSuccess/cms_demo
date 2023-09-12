import { IsNotEmpty } from 'class-validator';
import { LengthValidator } from '../../../validators/length.validator';

import { generateValidationMessage } from '../../../utils';

export class PermissionDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter permission code'),
  })
  @LengthValidator(1, 10, {
    message: (arg) =>
      generateValidationMessage(
        arg,
        'Max length of permission code is 10 characters',
      ),
  })
  code: string;
}
