import * as path from 'path';

import { IConfig } from '../types/interfaces';
import { Environ, NodeEnv } from '../types';
import { toBoolean } from '../utils';
import development from './development.config';
import test from './test.config';
import production from './production.config';

const nodeEnv = process.env.NODE_ENV as NodeEnv || Environ.development;
const envConfig = {
    development,
    test,
    production
}[nodeEnv]
/**
 *  Exports all environments variables neccessary to run the app and also some generic environment variables.
 */
const config: IConfig =  {
    ...envConfig,
    PORT: parseInt(process.env.PORT as string, 10),
    PGPORT: parseInt(envConfig.PGPORT as string, 10),
    NODE_ENV: nodeEnv,
    LOG_LEVEL: envConfig.LOG_LEVEL || 'debug',
    LOG_TO_FILE: toBoolean(process.env.LOG_TO_FILE || false),
    ROOTPATH: path.join(__dirname, '../../'),
    DATABASE_LOGGING: toBoolean(envConfig.DATABASE_LOGGING || false)
};




export default config;


