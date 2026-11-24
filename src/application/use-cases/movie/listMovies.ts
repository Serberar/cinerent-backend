import type { Deps } from '../../ports';

export const listMovies = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async () => {
  return { movieList: await movieRepo.findAll() };
};
