import { SessionEntity } from '../../../entities/session.entity';
import { returnObject } from '../../../utils';
import { LoginResponse } from '../interfaces/login-response.interface';

export const generateResponse = (session: SessionEntity, username: string) => {
  const response: LoginResponse = {
    username: username,
    refreshToken: session.refreshToken,
    accessToken: session.accessToken,
  };
  return returnObject<LoginResponse>(response);
};
