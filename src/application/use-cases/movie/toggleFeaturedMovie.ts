import { notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const toggleFeaturedMovie = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async ({ id }: { id: string }) => {
  const movie = await movieRepo.findById(id);
  if (!movie) throw notFound('Película no encontrada');

  movie.toggleFeatured();
  const updated = await movieRepo.toggleFeatured(movie);
  return { id: updated.id, movieTitle: updated.movieTitle, featured: updated.featured };
};
