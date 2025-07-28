import dotenv from 'dotenv';
import { EnvServerEnum } from '../enums';

dotenv.config();

export const envs = {
  nodeEnv: process.env.NODE_ENV || EnvServerEnum.DEVELOP,
  port: Number(process.env.PORT) || 3000,
  apiVersion: Number(process.env.ENV_VERSION) || 1,
  clientUrls: String(process.env.CLIENT_URLS)
    .split(',')
    .map(url => url.trim()) || ['http://localhost:5173'],
};
