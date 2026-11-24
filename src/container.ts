// Raíz de composición: el único sitio que une la aplicación con su infraestructura
import { createUseCases } from './application';
import { config } from './config';
import { genreRepo } from './infrastructure/db/genreRepo';
import { movieRepo } from './infrastructure/db/movieRepo';
import { productRepo } from './infrastructure/db/productRepo';
import { userRepo } from './infrastructure/db/userRepo';
import { createEmailSender } from './infrastructure/email/emailService';
import { passwordHasher } from './infrastructure/security/passwordHasher';
import { createTokenService } from './infrastructure/token/tokenService';

export const useCases = createUseCases({
  userRepo,
  productRepo,
  movieRepo,
  genreRepo,
  passwordHasher,
  tokenService: createTokenService({ secret: config.jwtSecret, expiresIn: config.jwtExpiresIn }),
  emailSender: createEmailSender({ smtp: config.smtp }),
  frontendUrl: config.frontendUrl,
  logger: console,
});
