/* eslint-disable @typescript-eslint/no-unused-vars */
import * as globalLogConfig from './global';
import 'reflect-metadata';
import { createConnection } from "typeorm";
import express, { json, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { IHttpErrorResponsePayload } from './types/interfaces';
import databaseProvider from './database';
import configSchema from './validations/config.schema';
import config from './config';
import { initLogger, createLogStream, errorResponse, successResponse,  constants, validationHandlerSync } from './utils';
import routes from './routes';
import cronProvider from './cron';

// Initialize and set logger as global variable
globalLogConfig.setDefaultLogger(initLogger);

// Initialize a Express server
const app = express();

// Integrate wiston logger with morgan
app.use(morgan('combined', { stream: createLogStream(logger) }));

// adds security middleware to handle potential attacks from HTTP requests
app.use(helmet());

// adds middleware for cross-origin resource sharing using the default package configuration
app.use(cors());

// adds middleware that parses requests with application/json data encoding
app.use(json());

// adds a heartbeat route for the culture
app.get('/', (req, res) => successResponse(res, { message: constants.PING }));

// engages all defined routes
app.use(routes);

// catches 404 errors and forwards them to error handlers
app.use((req, res, next) => next(constants.NOT_FOUND_PAYLOAD));

// handles all forwarded errors
app.use((err: IHttpErrorResponsePayload, req: Request, res: Response, next: NextFunction) => errorResponse(res, err.error, err.statusCode));


// validate that all required environment variables have been provided.
try {
  validationHandlerSync(configSchema, config);
} catch(error) {
  logger.error(error.message);
  process.exit(1);
}

// initialize the port constant
const port = config.PORT;

// Initialize DB connection
databaseProvider(createConnection)
.then(() => {
  logger.info('Successfully connected to the DB');
  // Add cron manager to server
  cronProvider();
// server listens for connections
app.listen(port, () => {
  logger.info(`The app is kicking on: ${port}`);
});
})
.catch(error => {
  logger.error(`Cannot connect to the DB: ${error.message}.`)
  process.exit(1);
})


export default app;
