import { notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const deleteGenre = ({ genreRepo }: Pick<Deps, 'genreRepo'>) => async ({ id }: { id: string }) => {
  if (!(await genreRepo.findById(id))) throw notFound('Género no encontrado');
  await genreRepo.delete(id);
  return { message: 'Género eliminado correctamente' };
};
