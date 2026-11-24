const { test } = require('node:test');
const assert = require('node:assert/strict');

const skip = !process.env.DATABASE_URL && 'necesita DATABASE_URL';

test('repositorios contra PostgreSQL', { skip }, async (t) => {
  const { db } = require('../../src/infrastructure/db/client');
  const userRepo = require('../../src/infrastructure/db/userRepo');
  const movieRepo = require('../../src/infrastructure/db/movieRepo');
  const productRepo = require('../../src/infrastructure/db/productRepo');
  const genreRepo = require('../../src/infrastructure/db/genreRepo');
  const { User } = require('../../src/domain/User');
  const { Movie } = require('../../src/domain/Movie');
  const { Genre } = require('../../src/domain/Genre');
  const { Product } = require('../../src/domain/Product');

  const clean = async () => {
    await db.product.deleteMany(); await db.movie.deleteMany(); await db.genre.deleteMany(); await db.user.deleteMany();
  };
  await clean();

  const user = User.create({
    firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
    cardNumber: '4111111111111234', email: 'ana@example.com', passwordHash: 'x',
  });
  const genre = Genre.create({ name: 'Terror', price: 2.5 });
  const movie = Movie.create({ movieTitle: 'Alien', desc: 'Terror espacial', year: 1979 });

  await t.test('guarda y recupera usuarios sin el número de tarjeta', async () => {
    await userRepo.create(user);
    const found = await userRepo.findByEmail('ANA@example.com');
    assert.equal(found.id, user.id);
    assert.equal(found.cardLast4, '1234');
  });

  await t.test('relaciona películas y géneros', async () => {
    await genreRepo.create(genre);
    const created = await movieRepo.create(movie, [genre.id]);
    assert.equal(created.genres[0].name, 'Terror');
  });

  await t.test('un alquiler devuelto deja de estar activo', async () => {
    const rental = Product.create({ userId: user.id, movieId: movie.id, movieTitle: movie.movieTitle, dias: 2 });
    await productRepo.create(rental);
    assert.equal((await productRepo.findAllActive()).length, 1);
    rental.markAsReturned();
    await productRepo.update(rental);
    assert.equal((await productRepo.findAllActive()).length, 0);
  });

  await clean();
  await db.$disconnect();
});
