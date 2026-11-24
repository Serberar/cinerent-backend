const config = require('./config');
const useCases = require('./container');
const createApp = require('./infrastructure/http/app');

const DAY_MS = 24 * 60 * 60 * 1000;

const returnExpired = () => useCases.returnExpired()
  .catch((error) => console.error('Devolución automática fallida:', error.message));

createApp({ useCases, frontendUrl: config.frontendUrl, trustProxy: config.trustProxy }).listen(config.port, () => {
  console.log(`http://localhost:${config.port}`);
  returnExpired();
  setInterval(returnExpired, DAY_MS);
});
