const createUseCases = require('../src/application');
const { User } = require('../src/domain/User');
const { Movie } = require('../src/domain/Movie');

function memoryRepo() {
  const rows = new Map();
  const save = (entity) => { rows.set(entity.id, entity); return Promise.resolve(entity); };
  return {
    rows,
    save,
    find: (test) => Promise.resolve([...rows.values()].find(test) ?? null),
    filter: (test) => Promise.resolve([...rows.values()].filter(test)),
    remove: (id) => Promise.resolve(rows.delete(id)),
  };
}

function setup() {
  const users = memoryRepo();
  const products = memoryRepo();
  const movies = memoryRepo();
  const genres = memoryRepo();
  const sent = [];
  const errors = [];

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
      updatePassword: async ({ id, passwordHash }) => { users.rows.get(id).passwordHash = passwordHash; },
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

  const addUser = (data = {}) => {
    const user = User.create({
      firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
      cardNumber: '4111 1111 1111 1234', email: 'ana@example.com', passwordHash: 'hash:secreta-1', ...data,
    });
    user.verifyEmail();
    if (data.role) user.role = data.role;
    users.rows.set(user.id, user);
    return user;
  };
  const addMovie = (data = {}) => {
    const movie = Movie.create({ movieTitle: 'Alien', desc: 'Terror espacial', year: 1979, ...data });
    movies.rows.set(movie.id, movie);
    return movie;
  };

  return { useCases, users, products, movies, genres, sent, errors, addUser, addMovie };
}

const REGISTER = {
  firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
  cardNumber: '4111111111111234', email: 'Ana@Example.com', password: 'secreta-1',
};

module.exports = { setup, REGISTER };
