import {
  ValidationOptions,
  isEmpty,
  isNumber,
  registerDecorator,
} from 'class-validator';

export function MinValidator(
  min: number,
  validationOptions: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'minValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isEmpty(value)) {
            if (!isNumber(value) || value < min) {
              return false;
            }
            return true;
          }
          return true;
        },
      },
    });
  };
}
