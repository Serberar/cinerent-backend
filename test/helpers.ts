import { createUseCases } from '../src/application';
import type { EmailTemplates } from '../src/application/ports';
import type { Genre } from '../src/domain/Genre';
import { Movie, type MovieData } from '../src/domain/Movie';
import type { Product } from '../src/domain/Product';
import { User, type NewUser, type Role } from '../src/domain/User';

function memoryRepo<T extends { id: string }>() {
  const rows = new Map<string, T>();
  const save = (entity: T): Promise<T> => { rows.set(entity.id, entity); return Promise.resolve(entity); };
  return {
    rows,
    save,
    find: (test: (row: T) => boolean): Promise<T | null> => Promise.resolve([...rows.values()].find(test) ?? null),
    filter: (test: (row: T) => boolean): Promise<T[]> => Promise.resolve([...rows.values()].filter(test)),
    remove: (id: string) => Promise.resolve(rows.delete(id)),
  };
}

export function setup() {
  const users = memoryRepo<User>();
  const products = memoryRepo<Product>();
  const movies = memoryRepo<Movie>();
  const genres = memoryRepo<Genre>();
  const sent: { to: string; template: keyof EmailTemplates; data: EmailTemplates[keyof EmailTemplates] }[] = [];
  const errors: unknown[][] = [];

  const useCases = createUseCases({
    userRepo: {
      findById: (id) => users.find((u) => u.id === id),
      findByEmail: (email) => users.find((u) => u.email === email.toLowerCase().trim()),
      findByVerificationToken: (token) => users.find((u) => u.emailVerificationToken === token),
      findAll: () => users.filter(() => true),
      create: users.save,
      update: users.save,
      updateProfile: users.save,
      updateCard: users.save,
      updateSuspension: users.save,
      updatePassword: async ({ id, passwordHash }) => { const user = users.rows.get(id); if (user) user.passwordHash = passwordHash; },
    },
    productRepo: {
      findById: (id) => products.find((p) => p.id === id),
      findByUser: (userId) => products.filter((p) => p.userId === userId),
      findAllActive: () => products.filter((p) => p.isActive()),
      create: products.save,
      update: products.save,
    },
    movieRepo: {
      findById: (id) => movies.find((m) => m.id === id),
      findAll: () => movies.filter((m) => m.active),
      findAllAdmin: () => movies.filter(() => true),
      findFeatured: () => movies.filter((m) => m.featured && m.active),
      create: movies.save,
      update: movies.save,
      toggle: movies.save,
      toggleFeatured: movies.save,
    },
    genreRepo: {
      findAll: () => genres.filter(() => true),
      findById: (id) => genres.find((g) => g.id === id),
      findByName: (name) => genres.find((g) => g.name === name),
      create: genres.save,
      update: genres.save,
      delete: genres.remove,
    },
    passwordHasher: { hash: async (p) => `hash:${p}`, compare: async (p, h) => h === `hash:${p}` },
    tokenService: {
      sign: (id) => `token:${id}`,
      verify: (token) => { if (!token.startsWith('token:')) throw new Error('bad token'); return token.slice(6); },
    },
    emailSender: { send: async (to, template, data) => { sent.push({ to, template, data }); } },
    frontendUrl: 'http://front.test',
    logger: { error: (...args) => errors.push(args) },
  });

  const addUser = ({ role, ...data }: Partial<NewUser> & { role?: Role } = {}) => {
    const user = User.create({
      firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
      cardNumber: '4111 1111 1111 1234', email: 'ana@example.com', passwordHash: 'hash:secreta-1', ...data,
    });
    user.verifyEmail();
    if (role) user.role = role;
    users.rows.set(user.id, user);
    return user;
  };
  const addMovie = (data: Partial<MovieData> = {}) => {
    const movie = Movie.create({ movieTitle: 'Alien', desc: 'Terror espacial', year: 1979, ...data });
    movies.rows.set(movie.id, movie);
    return movie;
  };

  return { useCases, users, products, movies, genres, sent, errors, addUser, addMovie };
}

export const REGISTER = {
  firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
  cardNumber: '4111111111111234', email: 'Ana@Example.com', password: 'secreta-1',
};
