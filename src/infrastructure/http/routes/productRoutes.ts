import { Router } from 'express';
import { handle } from '../handler';
import { currentUser, param, type RouteDeps } from '../types';
import { requireText } from '../validate';

export function productRoutes({ useCases, auth }: RouteDeps) {
  const router = Router();

  router.post('/rent', auth, handle(async (req) => {
    const { movieId } = requireText(req.body, ['movieId'], 'movieId y dias son requeridos');
    return useCases.rent({ userId: currentUser(req).id, movieId, dias: Number(req.body.dias) });
  }, 201));
  router.patch('/:id/return', auth, handle((req) => useCases.returnMovie({ userId: currentUser(req).id, productId: param(req, 'id') })));
  router.get('/history', auth, handle((req) => useCases.listHistory({ userId: currentUser(req).id })));

  return router;
}
