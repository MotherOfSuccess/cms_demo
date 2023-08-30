import { IsNotEmpty, IsOptional } from 'class-validator';
import { generateValidationMessage } from '../../../utils';
import { MinValidator } from '../../../validators/min-value.validator';

export class GetUserDto {
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter the number of pages'),
  })
  @MinValidator(0, {
    message: (arg) => generateValidationMessage(arg, 'Min value pages is 0'),
  })
  pages: number;

  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter the number of page'),
  })
  @MinValidator(1, {
    message: (arg) => generateValidationMessage(arg, 'Min value pages is 1'),
  })
  page: number;

  @IsOptional()
  input: string;
}
