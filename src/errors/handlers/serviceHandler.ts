import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { logger } from '../../shared/utils';

export const serviceHandler = (error: unknown, logPrefix: string) => {
  const err = error instanceof Error ? error : new Error(String(error));

  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const phrase = getReasonPhrase(statusCode);
  const message: string = `${logPrefix}${phrase}::${err.message}`;

  logger.error(message);

  throw new Error(phrase);
};
