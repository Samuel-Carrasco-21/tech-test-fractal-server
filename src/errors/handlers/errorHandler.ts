import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { HttpError } from '../classes';
import { logger } from '../../shared/utils';

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || getReasonPhrase(statusCode);

  console.error(`[Error] ${message}`, err.stack);

  logger.error(message);

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details && { details: err.details }),
  });
};
