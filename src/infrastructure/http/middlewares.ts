import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { UseCases } from '../../application';
import type { Logger } from '../../application/ports';
import { AppError, forbidden, unauthorized } from '../../domain/errors';
import type { Session } from './session';
import { currentUser, setUser } from './types';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function createMiddlewares({ useCases, session, frontendUrl, logger }: {
  useCases: UseCases; session: Session; frontendUrl: string; logger: Logger;
}) {
  const auth: RequestHandler = async (req, _res, next) => {
    try {
      const token = session.read(req);
      if (!token) throw unauthorized('Sesión requerida');
      setUser(req, await useCases.authenticate({ token }));
      next();
    } catch (error) {
      next(error);
    }
  };

  const admin: RequestHandler = (req, _res, next) => {
    next(currentUser(req).role === 'ADMIN' ? undefined : forbidden('Acceso no autorizado'));
  };

  // La cookie viaja sola, así que un cambio pedido desde otra web se rechaza (CSRF)
  const sameOrigin: RequestHandler = (req, _res, next) => {
    const origin = req.headers.origin;
    next(SAFE_METHODS.has(req.method) || !origin || origin === frontendUrl ? undefined : forbidden('Origen no permitido'));
  };

  // Los errores inesperados se registran, pero no se muestran al cliente
  const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    const status = error instanceof AppError ? error.status : Number((error as { status?: number }).status) || 500;
    if (status >= 500) logger.error(error);
    res.status(status).json({ error: status >= 500 ? 'Error interno del servidor' : (error as Error).message });
  };

  return { auth, admin, sameOrigin, errorHandler };
}
