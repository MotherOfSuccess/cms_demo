import { IsNotEmpty } from 'class-validator';
import { generateValidationMessage } from '../../../utils';

export class RenewTokenDto {
  @IsNotEmpty({
    message: (arg) => generateValidationMessage(arg, 'Enter refresh token'),
  })
  refreshToken: string;
}
