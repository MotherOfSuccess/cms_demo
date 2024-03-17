import { diskStorage } from 'multer';
import { ConfigurationService } from '../modules/shared/services/configuration/configuration.service';
import { Configuration } from '../modules/shared/constants/configuration.enum';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  validateExtention,
  validateFilename,
  validateFilesize,
} from './validators/file.validator';
import { HttpException } from '@nestjs/common';

export const multerFactory = async (
  configurationService: ConfigurationService,
) =>
  <MulterOptions>{
    storage: diskStorage({
      destination: configurationService.get(Configuration.MULTER_DEST),
      filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
      },
    }),
    async fileFilter(req, file, callback) {
      const validate_filename = await validateFilename(file, req);

      const validate_filesize = await validateFilesize(
        configurationService,
        file,
        req,
      );

      const validate_extention = await validateExtention(
        configurationService,
        file,
        req,
      );
      if (validate_extention instanceof HttpException)
        return callback(validate_extention, false);
      if (validate_filename instanceof HttpException)
        return callback(validate_filename, false);
      if (validate_filesize instanceof HttpException)
        return callback(validate_filesize, false);

      callback(null, true);
    },
  };
