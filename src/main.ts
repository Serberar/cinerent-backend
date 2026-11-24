import { config } from './config';
import { useCases } from './container';
import { createApp } from './infrastructure/http/app';

const DAY_MS = 24 * 60 * 60 * 1000;

const returnExpired = () => {
  useCases.returnExpired().catch((error: Error) => console.error('Devolución automática fallida:', error.message));
};

const { frontendUrl, cookie, trustProxy } = config;
createApp({ useCases, frontendUrl, cookie, trustProxy }).listen(config.port, () => {
  console.log(`http://localhost:${config.port}`);
  returnExpired();
  setInterval(returnExpired, DAY_MS);
});
