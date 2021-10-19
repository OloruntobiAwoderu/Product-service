import Joi from 'joi';
import constants from '../utils/constants';
import { Environ, IConfig } from '../types';
import { generateBoolySchema, generateNumberSchema, generateStringSchema, generateValidOptionSchema } from './generic.schema';

/**
 *  Validation schema for validating the environment variables required to run the app.
 */
const configSchema: Joi.ObjectSchema<IConfig> = Joi.object({
  DATABASE_LOGGING: generateBoolySchema('DATABASE_LOGGING' , constants.getConfigBoolErrorMsg('DATABASE_LOGGING')),
    PORT: generateNumberSchema('PORT', constants.getConfigErrorMsg('PORT')),
    NODE_ENV: generateValidOptionSchema('NODE_ENV',Object.keys(Environ), constants.getConfigErrorMsg('NODE_ENV')),
    LOG_LEVEL: generateValidOptionSchema('LOG_LEVEL',constants.logLevels, constants.getConfigErrorMsg('LOG_LEVEL')),
    LOG_TO_FILE: generateBoolySchema('LOG_TO_FILE' , constants.getConfigBoolErrorMsg('LOG_TO_FILE')),
    PGHOST:  generateStringSchema('PGHOST', constants.getConfigErrorMsg('PGHOST')),
    PGPORT: generateNumberSchema('PGPORT', constants.getConfigErrorMsg('PGPORT')),
    PGDATABASE: generateStringSchema('PGDATABASE', constants.getConfigErrorMsg('PGDATABASE')),
    PGUSER: generateStringSchema('PGUSER', constants.getConfigErrorMsg('PGUSER')),
    PGPASSWORD: generateStringSchema('PGPASSWORD', constants.getConfigErrorMsg('PGPASSWORD')),
}).unknown(true);

export default configSchema;