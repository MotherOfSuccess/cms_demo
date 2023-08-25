import * as dayjs from 'dayjs';
import { LOG_PATH } from '../constants';
import * as fs from 'fs';

export const writeFile = (data) => {
  const now = dayjs(Date.now()).format('YYYYMMDD');
  const path = `${LOG_PATH}/${now}.lg`;
  if (fs.existsSync(path)) {
    fs.appendFileSync(path, data);
  } else {
    fs.mkdirSync(LOG_PATH);
    fs.writeFileSync(path, data);
  }
};
