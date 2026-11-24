import { notFound } from '../../../domain/errors';
import type { MovieData } from '../../../domain/Movie';
import type { Deps } from '../../ports';

export const updateMovie = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async ({ id, genreIds, ...data }: Partial<MovieData> & { id: string; genreIds?: string[] }) => {
  const movie = await movieRepo.findById(id);
  if (!movie) throw notFound('Película no encontrada');

  movie.updateMovie(data);
  return movieRepo.update(movie, genreIds);
};
