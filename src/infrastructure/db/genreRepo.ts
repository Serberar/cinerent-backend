import type { Genre as GenreRow } from '@prisma/client';
import type { GenreRepo } from '../../application/ports';
import { Genre } from '../../domain/Genre';
import { db } from './client';

const toGenre = (row: GenreRow) => new Genre(row);
const orNull = (row: GenreRow | null) => (row ? toGenre(row) : null);

export const genreRepo: GenreRepo = {
  findAll: async () => (await db.genre.findMany({ orderBy: { name: 'asc' } })).map(toGenre),
  findById: async (id) => orNull(await db.genre.findUnique({ where: { id } })),
  findByName: async (name) => orNull(await db.genre.findUnique({ where: { name } })),
  create: async ({ id, name, price }) => toGenre(await db.genre.create({ data: { id, name, price } })),
  update: async ({ id, name, price }) => toGenre(await db.genre.update({ where: { id }, data: { name, price } })),
  delete: (id) => db.genre.delete({ where: { id } }),
};
