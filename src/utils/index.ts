import { ValidationArguments } from 'class-validator';

export const generateValidationMessage = (
  arg: ValidationArguments,
  message: string,
) => {
  return JSON.stringify({ [arg.property]: message });
};

export const returnObject = <T>(
  data: T | T[] | null,
  errorCode?: number,
  message?: string | null,
  errors?: [{ [key: string]: string }] | null,
) => {
  return {
    data: data,
    errorCode: !data ? 0 : errorCode ?? 0,
    message: !data ? null : message,
    errors: errors ?? null,
  };
};

export const sprintf = (str, arv) => {
  if (!arv) return str;
  return sprintf(str.replace('%s', arv.shift()), arv);
};
