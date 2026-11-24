import { notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const toggleMovie = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async ({ id }: { id: string }) => {
  const movie = await movieRepo.findById(id);
  if (!movie) throw notFound('Película no encontrada');

  movie.toggleActive();
  await movieRepo.toggle(movie);
  return { id: movie.id, movieTitle: movie.movieTitle, active: movie.active };
};
