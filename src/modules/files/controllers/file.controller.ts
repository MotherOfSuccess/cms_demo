import {
  Controller,
  HttpException,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '../services/file.service';
import { FileEntity } from '../../../entities/file.entity';
import { DataSource } from 'typeorm';
import { HandleException } from '../../../exceptions/HandleException';
import { SERVER_EXIT_CODE } from '../../../constants/enums/errors-code.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private dataSource: DataSource,
  ) {}
  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      const file_entity = new FileEntity();
      file_entity.originalName = file.originalname;
      file_entity.fileName = file.filename;
      file_entity.path = file.destination;
      file_entity.url = `${file.destination}/${file.originalname}`;
      file_entity.extention = path.parse(file.originalname).ext;

      const image = await this.fileService.add(file_entity);
      return image;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HandleException(
        SERVER_EXIT_CODE.INTERNAL_SERVER_ERROR,
        req.method,
        req.url,
        error,
      );
    }
  }
}
