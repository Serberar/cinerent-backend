import cors from 'cors';
import express, { type Express } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import type { UseCases } from '../../application';
import type { Logger } from '../../application/ports';
import { createMiddlewares } from './middlewares';
import { adminRoutes } from './routes/adminRoutes';
import { genreRoutes } from './routes/genreRoutes';
import { movieRoutes } from './routes/movieRoutes';
import { productRoutes } from './routes/productRoutes';
import { userRoutes } from './routes/userRoutes';
import { createSession, type SessionOptions } from './session';

const QUARTER_HOUR = 15 * 60 * 1000;

export interface AppOptions {
  useCases: UseCases;
  frontendUrl: string;
  cookie?: SessionOptions;
  trustProxy?: number | boolean;
  maxAuthAttempts?: number;
  logger?: Logger;
}

export function createApp({
  useCases, frontendUrl, cookie = { secure: false, sameSite: 'lax' }, trustProxy = false, maxAuthAttempts = 20, logger = console,
}: AppOptions): Express {
  const app = express();
  const session = createSession(cookie);
  const { auth, admin, sameOrigin, errorHandler } = createMiddlewares({ useCases, session, frontendUrl, logger });
  const deps = { useCases, session, auth, admin };

  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use(cors({ origin: frontendUrl, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });
  app.use(['/api/user/login', '/api/user/register'], rateLimit({
    windowMs: QUARTER_HOUR,
    limit: maxAuthAttempts,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Prueba dentro de unos minutos' },
  }));
  app.use('/api', sameOrigin);
  app.use('/api/user', userRoutes(deps));
  app.use('/api/product', productRoutes(deps));
  app.use('/api/movie', movieRoutes(deps));
  app.use('/api/genre', genreRoutes(deps));
  app.use('/api/admin', adminRoutes(deps));
  app.use((_req, res) => { res.status(404).json({ error: 'Ruta no encontrada' }); });
  app.use(errorHandler);

  return app;
}
