module.exports = function createMiddlewares({ useCases, logger }) {
  return {
    auth: async (req, res, next) => {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
      try {
        req.user = await useCases.authenticate({ token: header.slice(7) });
        return next();
      } catch (error) {
        return next(error);
      }
    },

    admin: (req, res, next) => (
      req.user.role === 'ADMIN' ? next() : res.status(403).json({ error: 'Acceso no autorizado' })
    ),

    // Los errores inesperados se registran, pero no se muestran al cliente
    errorHandler: (error, req, res, next) => { // eslint-disable-line no-unused-vars
      const status = error.status ?? 500;
      if (status >= 500) logger.error(error);
      res.status(status).json({ error: status >= 500 ? 'Error interno del servidor' : error.message });
    },
  };
};
