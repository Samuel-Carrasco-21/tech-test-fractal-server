import { Response } from 'express';
import { buildResponse, logger } from '../utils';
import { getReasonPhrase } from 'http-status-codes';

export const commonSuccessHandler = (
  logMessage: string,
  log: string,
  statusCode: number,
  data: any,
  res: Response
) => {
  logger.info(log + logMessage);

  const successMessage = getReasonPhrase(statusCode) + '::' + logMessage;

  res
    .status(statusCode)
    .json(buildResponse(true, statusCode, successMessage, data));
};
