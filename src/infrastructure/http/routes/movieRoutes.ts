import { Router } from 'express';
import { handle } from '../handler';
import type { MovieData } from '../../../domain/Movie';
import { badRequest } from '../../../domain/errors';
import { param, type RouteDeps } from '../types';
import { optionalText, requireText } from '../validate';

const TEXTS = ['posterUrl', 'director', 'actors', 'runtime'] as const;

function details(body: unknown): Omit<Partial<MovieData>, 'movieTitle' | 'desc'> & { genreIds?: string[] } {
  const { year, genreIds } = (body ?? {}) as { year?: unknown; genreIds?: unknown };
  if (genreIds !== undefined && !(Array.isArray(genreIds) && genreIds.every((id) => typeof id === 'string'))) {
    throw badRequest('Los géneros no son válidos');
  }
  const number = Number(year);
  return {
    ...optionalText(body, TEXTS),
    ...(year !== undefined && year !== null && Number.isInteger(number) && { year: number }),
    ...(genreIds && { genreIds: genreIds as string[] }),
  };
}

export function movieRoutes({ useCases, auth, admin }: RouteDeps) {
  const router = Router();

  router.get('/all-movies', handle(() => useCases.listMovies()));
  router.get('/featured', handle(() => useCases.getFeaturedMovies()));
  router.post('/create-a-new-movie', auth, admin, handle(async (req) => useCases.createMovie({
    ...details(req.body), ...requireText(req.body, ['movieTitle', 'desc'], 'El título y la descripción son requeridos'),
  }), 201));
  router.put('/:id', auth, admin, handle(async (req) => useCases.updateMovie({
    ...details(req.body), ...optionalText(req.body, ['movieTitle', 'desc']), id: param(req, 'id'),
  })));
  router.patch('/:id/toggle', auth, admin, handle((req) => useCases.toggleMovie({ id: param(req, 'id') })));
  router.patch('/:id/toggle-featured', auth, admin, handle((req) => useCases.toggleFeaturedMovie({ id: param(req, 'id') })));

  return router;
}
