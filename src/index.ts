import { envs } from './config';
import app from './app';
import { logger } from './shared/utils';
import { EnvServerEnum } from './enums';

const { port, apiVersion, nodeEnv } = envs;

const PORT = port;
const API = `http://localhost:${PORT}/api/v${apiVersion}`;

app.listen(PORT, async () => {
  if (nodeEnv === EnvServerEnum.DEVELOP) {
    logger.info(`🚀 Server is running on ${API}!`);
    return;
  }
  logger.info('🚀 Server is running!');
});
