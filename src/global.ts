/* eslint-disable @typescript-eslint/no-namespace */
import * as winston from 'winston';
import { IStockUpdateDetail } from './types';

declare global {
  type Log = winston.Logger;
  const logger: Log;
  namespace NodeJS {
    interface Global {
      logger: Log;
    }
  }
  namespace Express {
    export interface Request {
       items?: IStockUpdateDetail
    }
  }
}


export const setDefaultLogger = (initLogger: ()=> winston.Logger): void => {
    global.logger = initLogger();
}