const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const createMiddlewares = require('./middlewares');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const adminRoutes = require('./routes/adminRoutes');

const QUARTER_HOUR = 15 * 60 * 1000;

module.exports = function createApp({ useCases, frontendUrl, trustProxy = false, maxAuthAttempts = 20, logger = console }) {
  const app = express();
  const { auth, admin, errorHandler } = createMiddlewares({ useCases, logger });
  const deps = { useCases, auth, admin };

  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use(cors({ origin: frontendUrl, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use(['/api/user/login', '/api/user/register'], rateLimit({
    windowMs: QUARTER_HOUR,
    limit: maxAuthAttempts,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Prueba dentro de unos minutos' },
  }));
  app.use('/api/user', userRoutes(deps));
  app.use('/api/product', productRoutes(deps));
  app.use('/api/movie', movieRoutes(deps));
  app.use('/api/genre', genreRoutes(deps));
  app.use('/api/admin', adminRoutes(deps));
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use(errorHandler);

  return app;
};
