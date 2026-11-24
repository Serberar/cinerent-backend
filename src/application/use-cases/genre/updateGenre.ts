import { conflict, notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const updateGenre = ({ genreRepo }: Pick<Deps, 'genreRepo'>) => async ({ id, name, price }: { id: string; name?: unknown; price?: unknown }) => {
  const genre = await genreRepo.findById(id);
  if (!genre) throw notFound('Género no encontrado');

  genre.update({ name, price });
  const sameName = await genreRepo.findByName(genre.name);
  if (sameName && sameName.id !== id) throw conflict('Ya existe un género con ese nombre');
  return genreRepo.update(genre);
};
