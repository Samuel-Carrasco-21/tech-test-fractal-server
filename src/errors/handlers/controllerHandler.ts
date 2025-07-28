import { NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { logger } from '../../shared/utils';
import { InternalServerError } from '../utils';

export const controllerHandler = (
  error: unknown,
  logPrefix: string,
  next: NextFunction
) => {
  const err = error instanceof Error ? error : new Error(String(error));

  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const phrase = getReasonPhrase(statusCode);
  const message: string = `${logPrefix}${phrase}::${err.message}`;

  logger.error(message);

  return next(InternalServerError(phrase));
};
