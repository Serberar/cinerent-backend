import type { Prisma } from '@prisma/client';
import type { MovieRepo } from '../../application/ports';
import { Movie } from '../../domain/Movie';
import { db } from './client';

const include = { genres: { select: { id: true, name: true, price: true } } } satisfies Prisma.MovieInclude;

type MovieRow = Prisma.MovieGetPayload<{ include: typeof include }>;

const toMovie = (row: MovieRow) => new Movie(row);
const ids = (list: string[]) => list.map((id) => ({ id }));
const columns = ({ movieTitle, desc, year, posterUrl, director, actors, runtime }: Movie) => (
  { movieTitle, desc, year, posterUrl, director, actors, runtime }
);

export const movieRepo: MovieRepo = {
  findById: async (id) => {
    const row = await db.movie.findUnique({ where: { id }, include });
    return row ? toMovie(row) : null;
  },
  findAll: async () => (await db.movie.findMany({ where: { active: true }, include })).map(toMovie),
  findAllAdmin: async () => (await db.movie.findMany({ include })).map(toMovie),
  findFeatured: async () => (await db.movie.findMany({ where: { featured: true, active: true }, include })).map(toMovie),
  create: async (movie, genreIds) => toMovie(await db.movie.create({
    data: { id: movie.id, ...columns(movie), active: movie.active, genres: { connect: ids(genreIds) } },
    include,
  })),
  update: async (movie, genreIds) => toMovie(await db.movie.update({
    where: { id: movie.id },
    data: { ...columns(movie), ...(genreIds && { genres: { set: ids(genreIds) } }) },
    include,
  })),
  toggle: ({ id, active }) => db.movie.update({ where: { id }, data: { active } }),
  toggleFeatured: async ({ id, featured }) => toMovie(await db.movie.update({ where: { id }, data: { featured }, include })),
};
