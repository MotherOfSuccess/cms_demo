import * as path from 'path';
import { NORMAL_ALPHABEL_REGEX, SPECIAL_ALPHABEL_REGEX } from '../../constants';
import { InvalidFileNameException } from '../../exceptions/file/InvalidFilenameException';
import { FILE_EXIT_CODE } from '../../constants/enums/errors-code.enum';
import { ConfigurationService } from '../../modules/shared/services/configuration/configuration.service';
import { Configuration } from '../../modules/shared/constants/configuration.enum';
import { InvalidFileSizeException } from '../../exceptions/file/InvalidFileSizeException';
import { sprintf } from '../../utils';
import { ErrorMessage } from '../../constants/enums/errors_message';
import { InvalidFileExtentionException } from '../../exceptions/file/InvalidFileExtentionException';

export const validateFilename = (file: any, req: Request) => {
  const name = path.parse(file.originalname).name;

  const special_regex = SPECIAL_ALPHABEL_REGEX;
  const normal_regex = NORMAL_ALPHABEL_REGEX;

  const validate_special = special_regex.test(name);
  const validate_normal = normal_regex.test(name);

  if (validate_special) {
    return new InvalidFileNameException(
      FILE_EXIT_CODE.INVALID_NAME,
      req.method,
      req.url,
    );
  }

  if (!validate_normal) {
    return new InvalidFileNameException(
      FILE_EXIT_CODE.INVALID_NAME,
      req.method,
      req.url,
    );
  }
  return null;
};

export const validateFilesize = async (
  configurationService: ConfigurationService,
  file: any,
  req: Request,
) => {
  const size = file.size;
  const max_file_size = parseInt(
    configurationService.get(Configuration.MAX_FILE_SIZE_VALUE),
  );
  if (size > max_file_size) {
    return new InvalidFileSizeException(
      FILE_EXIT_CODE.INVALID_SIZE,
      req.method,
      req.url,
      sprintf(
        ErrorMessage.FILE_SIZE_TOO_LARGE_ERROR,
        file.originalname,
        configurationService.get(Configuration.MAX_FILE_SIZE_NAME),
      ),
    );
  }
  return null;
};

export const validateExtention = async (
  configurationService: ConfigurationService,
  file: any,
  req: Request,
) => {
  const correct_extention = configurationService.get(
    Configuration.EXTENSION_NAMES,
  );

  const arr_extention = await correct_extention.split(', ');

  const extention = path.parse(file.originalname).ext.slice(1);
  if (!arr_extention.includes(extention)) {
    return new InvalidFileExtentionException(
      FILE_EXIT_CODE.INVALID_EXTENSION,
      req.method,
      req.url,
      sprintf(
        ErrorMessage.FILE_EXTENSION_INVALID_ERROR,
        file.originalName,
        extention,
      ),
    );
  }
};
