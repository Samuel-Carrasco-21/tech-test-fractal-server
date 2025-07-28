import { envs } from '../../config';
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { EnvServerEnum } from '../../enums';

const logsDir = path.join(
  __dirname,
  envs.nodeEnv === EnvServerEnum.PRODUCTION ? '../../logs' : '../../../logs'
);
if (!fs.existsSync(logsDir) && envs.nodeEnv !== EnvServerEnum.PRODUCTION) {
  fs.mkdirSync(logsDir);
}

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${level}:[${timestamp}] ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
    winston.format.simple()
  ),
  transports: [],
});

if (envs.nodeEnv === EnvServerEnum.DEVELOP) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
        myFormat
      ),
    })
  );

  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    })
  );

  logger.add(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    })
  );
}

if (envs.nodeEnv === EnvServerEnum.PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
        myFormat
      ),
    })
  );
}

export default logger;
