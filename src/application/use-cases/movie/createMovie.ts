import { Movie, type MovieData } from '../../../domain/Movie';
import type { Deps } from '../../ports';

export const createMovie = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async ({ genreIds = [], ...data }: MovieData & { genreIds?: string[] }) => {
  return movieRepo.create(Movie.create(data), genreIds);
};
