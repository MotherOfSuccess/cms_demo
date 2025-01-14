import { ValidationArguments } from 'class-validator';
import { HttpResponsePaging } from '../interfaces/http-response-paging.interface';
import { HttpResponse } from '../interfaces/http-response.interface';
import { UNKNOW_EXIT_CODE } from '../constants/enums/errors-code.enum';
import { MiddlewareConsumer, RequestMethod, SetMetadata } from '@nestjs/common';
import { VerifyMiddlewares } from '../modules/auth/middlewares/auth.middleware';
import { Roles } from '../constants/enums/roles.enum';
import slugify from 'slugify';

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
): HttpResponse<T> => {
  return {
    data: data,
    errorCode: !data ? 0 : errorCode ?? 0,
    message: !data ? null : message,
    errors: errors ?? null,
  };
};

export const returnObjectWithPagination = <T>(
  page: number,
  pages: number,
  data: T | T[] | null,
  count?: number,
  errorCode?: number,
  message?: string | null,
  errors?: [{ [key: string]: string }] | null,
): HttpResponsePaging<T> => {
  return {
    data: {
      page,
      pages,
      data,
      count,
    },
    errorCode: data ? 0 : errorCode ?? UNKNOW_EXIT_CODE.UNKNOW_ERROR,
    errors: errors ?? null,
    message: data ? null : message,
  };
};

export const sprintf = (str, ...argv) => {
  if (!argv.length) return str;
  return sprintf(str.replace('%s', argv.shift()), ...argv);
};

export const isActiveDate = (startAt: Date, endAt: Date) => {
  const now = Date.now();
  return startAt.getTime() < now && endAt.getTime() >= now;
};

export const _slugify = (slug: string) => {
  slug = slugify(slug, {
    remove: /[*+~.()'"!:@]/g,
    trim: true,
    lower: true,
    locale: 'vi',
  });
  return slug;
};

export const applyMiddlewares = (consumer: MiddlewareConsumer) => {
  consumer
    .apply(VerifyMiddlewares)
    .exclude({ path: 'auth/login', method: RequestMethod.POST })
    .forRoutes({ path: '*', method: RequestMethod.ALL });
};

export const Permissions = (...roles: Roles[]) => SetMetadata('roles', roles);
