import { Genre } from '../../../domain/Genre';
import { conflict } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const createGenre = ({ genreRepo }: Pick<Deps, 'genreRepo'>) => async ({ name, price }: { name: unknown; price?: unknown }) => {
  const genre = Genre.create({ name, price });
  if (await genreRepo.findByName(genre.name)) throw conflict('El género ya existe');
  return genreRepo.create(genre);
};
