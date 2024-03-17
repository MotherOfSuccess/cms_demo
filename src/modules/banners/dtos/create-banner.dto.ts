import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { generateValidationMessage } from '../../../utils';
import { DateValidator } from '../../../validators/date.validator';
import { Transform } from 'class-transformer';

export class CreateBannerDto {
  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter the start day'),
  })
  @DateValidator({
    message: (arg) =>
      generateValidationMessage(arg, 'Wrong type of start date'),
  })
  startAt: Date;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter the end day'),
  })
  @DateValidator({
    message: (arg) => generateValidationMessage(arg, 'Wrong type of end date'),
  })
  endAt: Date;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) => generateValidationMessage(arg, 'Please enter title'),
  })
  title: string;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) =>
      generateValidationMessage(arg, 'Please enter the end day'),
  })
  @IsUUID('all', {
    message: (arg) => generateValidationMessage(arg, 'Please choose the image'),
  })
  fileID: string;

  @Transform((params) =>
    params.value ? params.value.toString().trim() : params.value,
  )
  @IsNotEmpty({
    message: (arg) => generateValidationMessage(arg, 'Please choose language'),
  })
  languageCode: string;

  @IsOptional()
  status: boolean;
}
