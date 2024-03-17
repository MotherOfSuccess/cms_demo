import { HttpException, HttpStatus } from '@nestjs/common';
import { FILE_EXIT_CODE } from '../../constants/enums/errors-code.enum';
import { LogService } from '../../modules/log/services/log.service';
import { Levels } from '../../constants/enums/levels.enum';

export class InvalidFileSizeException extends HttpException {
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
        errorCode: errorCode ?? FILE_EXIT_CODE.INVALID_SIZE,
        message: message ?? `File too large`,
      },
      status || HttpStatus.PAYLOAD_TOO_LARGE,
    );
    this.logService.writeLog(
      Levels.ERROR,
      method,
      path,
      message ?? `File too large`,
    );
  }
}
