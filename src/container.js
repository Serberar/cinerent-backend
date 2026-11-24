// Raíz de composición: el único sitio que une la aplicación con su infraestructura
const config = require('./config');
const createUseCases = require('./application');
const createTokenService = require('./infrastructure/token/tokenService');
const createEmailSender = require('./infrastructure/email/emailService');

module.exports = createUseCases({
  userRepo: require('./infrastructure/db/userRepo'),
  productRepo: require('./infrastructure/db/productRepo'),
  movieRepo: require('./infrastructure/db/movieRepo'),
  genreRepo: require('./infrastructure/db/genreRepo'),
  passwordHasher: require('./infrastructure/security/passwordHasher'),
  tokenService: createTokenService({ secret: config.jwtSecret, expiresIn: config.jwtExpiresIn }),
  emailSender: createEmailSender({ smtp: config.smtp }),
  frontendUrl: config.frontendUrl,
  logger: console,
});
