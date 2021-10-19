import * as winston from 'winston';
import { SellUpdateOrDelete } from './custom.types';

export interface IObjectKeys {
    /**
     * Object literal definition
     */
    [key: string]: number | string | undefined | boolean | Record<string, unknown>;
  }

export interface IConfig {
    /**
     * The port the server listens on for requests.
     */
    PORT: number;
    /**
     * The specific environment where the server is running. 
     */
    NODE_ENV: string;
    /**
     * The log level of the application. 
     */
    LOG_LEVEL?: string;
    /**
     * Determines whether to stream the logs to a file. 
     */
    LOG_TO_FILE?: boolean | string;
    /**
     *  The root path of the app. 
     */
    ROOTPATH?: string;
    /**
     *  The host name for DB. 
     */
    PGHOST: string;
    /**
     *  The DB host port. 
     */
    PGPORT: number;
    /**
     *  The DB name. 
     */
    PGDATABASE: string;
    /**
     *  The user name for DB authentication. 
     */
    PGUSER: string;
    /**
     *  The user password for DB authentication. 
     */
    PGPASSWORD: string;
    /**
     *  A boolean that determines whether the sql queries would show up on the log. 
     */
    DATABASE_LOGGING?: boolean | string
}

export interface ISyncValidationResult<T> {
     /**
     * Successfully validated payload. 
     */
    value: T;
}

export interface IHttpErrorResponsePayload {
    /**
     * The status code of the error. 
     */
    statusCode: number;
    /**
     * A descriptive error message. 
     */
    error: string;
}

export interface CustomNodeJsGlobal extends NodeJS.Global {
    logger: winston.Logger;
}

export interface IStockUpdateDetail {
 delete: SellUpdateOrDelete[];
update: SellUpdateOrDelete[];
}

export interface ISellUpdateOrDeleteResponse {
    error?: string;
    data?: IStockUpdateDetail;
}
