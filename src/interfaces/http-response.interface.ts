import { HttpNonResponse } from './http-non-response.interface';

export type HttpResponse<T> = HttpNonResponse & {
  data: T | T[] | null;
};
