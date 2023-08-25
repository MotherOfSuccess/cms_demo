import { ConsoleLogger, Injectable } from '@nestjs/common';
import { writeFile } from '../../../utils/log';
import { Levels } from '../../../constants/enums/levels.enum';

@Injectable()
export class LogService extends ConsoleLogger {
  writeLog(level: Levels, method: string, path: string, message: string) {
    const data = `[${level}] ${new Date().toISOString()}: [${method} ${path}] ${message}\r\n`;
    console.log(data);
    writeFile(data);
  }
}
