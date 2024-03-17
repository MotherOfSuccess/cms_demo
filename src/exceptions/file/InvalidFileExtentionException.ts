import { HttpException, HttpStatus } from '@nestjs/common';
import { LogService } from '../../modules/log/services/log.service';
import { FILE_EXIT_CODE } from '../../constants/enums/errors-code.enum';
import { Levels } from '../../constants/enums/levels.enum';

export class InvalidFileExtentionException extends HttpException {
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
        errorCode: errorCode ?? FILE_EXIT_CODE.INVALID_EXTENSION,
        message: message ?? `File not available`,
      },
      status ?? HttpStatus.BAD_REQUEST,
    );

    this.logService.writeLog(
      Levels.ERROR,
      method,
      path,
      message ?? `File not available`,
    );
  }
}
