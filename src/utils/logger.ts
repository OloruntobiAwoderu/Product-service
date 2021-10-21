import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import config from '../config';
import { CustomStreamOption } from '../types/custom.types'
import constants from './constants';

const { combine, label: winstonLabel, timestamp, colorize, printf } = winston.format;

/**
 * Configures an instance of the winston logger for the application.
 * @param { string } label - A label to tag the logs with.
 * @returns { winston.Logger } - An instance of the winston logger with custom properties.
 */
const initLogger = (label = 'APPLOG'): winston.Logger => {
  // Configuration properties for the logs written to the stdout
  const consoleOpt = {
    level: constants.logLevels.includes(config.LOG_LEVEL as string) ? config.LOG_LEVEL : 'debug',
    handleExceptions: true,
    format: combine(
      colorize({ all: true }),
      printf(
        (msg) => `[${new Date(msg.timestamp).toUTCString()}]: ${msg.label} : - ${msg.level}: ${
          msg.message
        }`
      )
    )
  };
  // A collection of transports (where winston sends the logs) configurations.
  const transportConfig: Partial<winston.transports.ConsoleTransportInstance | winston.transports.FileTransportInstance>[] = [new winston.transports.Console(consoleOpt)];
  // Check if logs should be piped to a file.
  if (config.LOG_TO_FILE) {
    const filename = path.join(config.ROOTPATH as string, 'app.log');
    if (!fs.existsSync(filename)) fs.mkdirSync(filename);
    // Include transport configuration for logs written to a file.
    transportConfig.push(new winston.transports.File({ ...consoleOpt, filename }));
  }
  // Create and configure winston instance.
  const logger = winston.createLogger({
    format: combine(
      timestamp(),
      winstonLabel({
        label: `[${label}]`
      })
    ),
    transports: transportConfig as winston.transport[],
    exitOnError: false
  });

  return logger;
}

const  createLogStream = (loggerInstance: winston.Logger): CustomStreamOption => ({
    write: (message: string) => loggerInstance.info(message)
})

export  { initLogger,  createLogStream };
