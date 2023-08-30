import { HttpNonResponse } from './http-non-response.interface';

export type HttpResponsePaging<T> = HttpNonResponse & {
  data: {
    page: number;
    pages: number;
    data: T | T[] | null;
    count: number;
  };
};
