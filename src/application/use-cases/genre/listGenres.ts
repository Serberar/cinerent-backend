import type { Deps } from '../../ports';

export const listGenres = ({ genreRepo }: Pick<Deps, 'genreRepo'>) => async () => {
  return genreRepo.findAll();
};
