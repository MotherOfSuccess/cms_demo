import {
  ValidationOptions,
  isDateString,
  isEmpty,
  registerDecorator,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function DateValidator(validationOptions: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DataValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!isEmpty(value)) {
            if (isDateString(value, { strict: true })) {
              return dayjs(value, 'YYYY-MM-DD', true).isValid();
            }
            return false;
          }
          return true;
        },
      },
    });
  };
}
