import { HttpException, HttpStatus } from '@nestjs/common';
import { Levels } from '../constants/enums/levels.enum';
import { LogService } from '../modules/log/services/log.service';

export class HandleException extends HttpException {
  private logService = new LogService();
  constructor(
    errorCode?: number,
    method?: string,
    path?: string,
    message?: string,
    status?: HttpStatus,
  ) {
    super(
      {
        errorCode: errorCode ?? 0,
        message: message ?? 'Internal Server Error',
      },
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this.logService.writeLog(
      Levels.ERROR,
      method,
      path,
      message ?? 'Internal Server Error',
    );
  }
}
