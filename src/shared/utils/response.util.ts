import { IResponse } from '../interfaces';

const buildResponse = (
  success: boolean,
  status: number,
  message: string,
  data?: any
): IResponse => {
  return {
    success,
    status,
    message,
    data,
  };
};

export default buildResponse;
