import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../classes';

export const BadRequest = (message: string, details?: any) =>
  new HttpError(message, StatusCodes.BAD_REQUEST, details);

export const NotFound = (message: string, details?: any) =>
  new HttpError(message, StatusCodes.NOT_FOUND, details);

export const InternalServerError = (message: string, details?: any) =>
  new HttpError(message, StatusCodes.INTERNAL_SERVER_ERROR, details);

export const Unauthorized = (message: string, details?: any) =>
  new HttpError(message, StatusCodes.UNAUTHORIZED, details);

export const Forbidden = (message: string, details?: any) =>
  new HttpError(message, StatusCodes.FORBIDDEN, details);

export const TooManyRequest = (message: string, details?: any) =>
  new HttpError(message, StatusCodes.TOO_MANY_REQUESTS, details);
