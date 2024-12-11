import winston from 'winston';
import path from 'path';

// Define custom log levels (optional)
interface LogLevels extends winston.LoggerOptions {
  levels: {
    error: 0;
    warn: 1;
    info: 2;
    debug: 3;
  };
}

// Define the Logger interface
interface LoggerInterface extends Omit<winston.Logger, 'stream'> {
  stream: {
    write: (message: string) => void;
  };
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Write all logs with importance level of 'error' or less to 'error.log'
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of 'info' or less to 'combined.log'
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production then log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// Create a stream object with a 'write' function that will be used by Morgan
(logger as unknown as LoggerInterface).stream = {
  write: (message: string) => logger.info(message.trim()),
};

export default logger;