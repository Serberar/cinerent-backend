import { Router } from 'express';
import { handle } from '../handler';
import { param, type RouteDeps } from '../types';
import { optionalText } from '../validate';

const PROFILE = ['firstName', 'lastName', 'phone', 'address'] as const;

export function adminRoutes({ useCases, auth, admin }: RouteDeps) {
  const router = Router();
  router.use(auth, admin);

  router.get('/all-movies', handle(() => useCases.listAllMovies()));
  router.get('/alquileres', handle(() => useCases.listActive()));
  router.get('/lista-de-usuarios', handle(() => useCases.listUsers()));
  router.get('/:id', handle((req) => useCases.getUserDetail({ userId: param(req, 'id') })));
  router.put('/:id', handle((req) => useCases.updateUserAdmin({ ...optionalText(req.body, PROFILE), userId: param(req, 'id') })));
  router.patch('/:id/suspend', handle((req) => useCases.suspendUser({ userId: param(req, 'id'), ...optionalText(req.body, ['note']) })));
  router.patch('/:id/password', handle((req) => useCases.resetUserPassword({ userId: param(req, 'id'), newPassword: req.body?.newPassword })));

  return router;
}
