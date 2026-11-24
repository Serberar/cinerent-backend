import type { Deps } from '../../ports';

export const listAllMovies = ({ movieRepo }: Pick<Deps, 'movieRepo'>) => async () => {
  return movieRepo.findAllAdmin();
};
