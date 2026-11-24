import type { Deps } from '../../ports';

export const getFeaturedMovies = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async () => {
  return movieRepo.findFeatured();
};
