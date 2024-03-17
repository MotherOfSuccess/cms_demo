import {
  DATABASE_EXIT_CODE,
  VALIDATION_EXIT_CODE,
} from '../../../constants/enums/errors-code.enum';
import { HandleException } from '../../../exceptions/HandleException';
import { FileService } from '../../files/services/file.service';
import { LanguageService } from '../../languages/services/language.service';
import { ErrorMasage } from '../constants/error-message.enum';

export const validateFile = async (
  fileID: string,
  fileService: FileService,
  req: Request,
) => {
  const file = await fileService.findByID(fileID);
  if (!file) {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      'File not found',
    );
  }
  return file;
};

export const validateLanguage = async (
  languageCode: string,
  languageService: LanguageService,
  req: Request,
) => {
  const language = await languageService.findByCode(languageCode);
  if (!language) {
    return new HandleException(
      DATABASE_EXIT_CODE.NO_CONTENT,
      req.method,
      req.url,
      'Language not found',
    );
  }
  return language;
};

export const validateDate = (startAt: Date, endAt: Date, req: Request) => {
  if (new Date(startAt) > new Date(endAt)) {
    return new HandleException(
      VALIDATION_EXIT_CODE.INVALID_VALUE,
      req.method,
      req.url,
      ErrorMasage.DATES_INVALID_ERROR,
    );
  }
  return null;
};
