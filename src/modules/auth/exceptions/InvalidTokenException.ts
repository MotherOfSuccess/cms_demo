import { HttpException, HttpStatus } from '@nestjs/common';
import { LogService } from '../../log/services/log.service';
import { Levels } from '../../../constants/enums/levels.enum';

export class InvalidTokenException extends HttpException {
  private logService = new LogService();
  constructor(
    token: string,
    errorCode?: number,
    method?: string,
    path?: string,
    message?: string,
    status?: HttpStatus,
  ) {
    super(
      {
        errorCode: errorCode ?? 0,
        message: message ?? `Invalid token (token: ${token})`,
      },
      status || HttpStatus.UNAUTHORIZED,
    );
    this.logService.writeLog(
      Levels.ERROR,
      method,
      path,
      message ?? `Invalid token (token: ${token})`,
    );
  }
}
