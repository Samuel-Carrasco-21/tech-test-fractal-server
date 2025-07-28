import express, { Application } from 'express';
import router from './routes';
import { envs } from './config';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './errors/handlers';

const app: Application = express();
const { clientUrls, apiVersion } = envs;

app.use(express.json());
app.use(morgan('tiny'));

const corsOptions = {
  origin: clientUrls,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

const API: string = `/api/v${apiVersion}`;
app.use(API, router);
app.use(errorHandler);

export default app;
