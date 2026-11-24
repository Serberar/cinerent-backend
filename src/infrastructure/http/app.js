const express = require('express');
const cors = require('cors');

const createMiddlewares = require('./middlewares');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const adminRoutes = require('./routes/adminRoutes');

module.exports = function createApp({ useCases, frontendUrl, logger = console }) {
  const app = express();
  const { auth, admin, errorHandler } = createMiddlewares({ useCases, logger });
  const deps = { useCases, auth, admin };

  app.disable('x-powered-by');
  app.use(cors({ origin: frontendUrl, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/user', userRoutes(deps));
  app.use('/api/product', productRoutes(deps));
  app.use('/api/movie', movieRoutes(deps));
  app.use('/api/genre', genreRoutes(deps));
  app.use('/api/admin', adminRoutes(deps));
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use(errorHandler);

  return app;
};
