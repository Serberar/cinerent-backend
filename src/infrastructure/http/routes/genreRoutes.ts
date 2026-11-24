import { Router } from 'express';
import { handle } from '../handler';
import { param, type RouteDeps } from '../types';
import { requireText } from '../validate';

export function genreRoutes({ useCases, auth, admin }: RouteDeps) {
  const router = Router();

  router.get('/', handle(() => useCases.listGenres()));
  router.post('/', auth, admin, handle(async (req) => {
    const { name } = requireText(req.body, ['name'], 'El nombre es requerido');
    return useCases.createGenre({ name, price: req.body.price });
  }, 201));
  router.put('/:id', auth, admin, handle((req) => (
    useCases.updateGenre({ id: param(req, 'id'), name: req.body?.name, price: req.body?.price })
  )));
  router.delete('/:id', auth, admin, handle((req) => useCases.deleteGenre({ id: param(req, 'id') })));

  return router;
}
