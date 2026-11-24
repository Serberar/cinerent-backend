const { test } = require('node:test');
const assert = require('node:assert/strict');
const { setup } = require('../helpers');

test('el catálogo público oculta las películas desactivadas', async () => {
  const { useCases, addMovie } = setup();
  const movie = addMovie();
  await useCases.toggleMovie({ id: movie.id });
  assert.equal((await useCases.listMovies()).movieList.length, 0);
  assert.equal((await useCases.listAllMovies()).length, 1);
});

test('destacar una película la añade a destacadas', async () => {
  const { useCases, addMovie } = setup();
  const movie = addMovie();
  await useCases.toggleFeaturedMovie({ id: movie.id });
  assert.deepEqual((await useCases.getFeaturedMovies()).map((m) => m.id), [movie.id]);
});

test('no hay dos géneros con el mismo nombre', async () => {
  const { useCases } = setup();
  await useCases.createGenre({ name: 'Terror', price: 2 });
  const drama = await useCases.createGenre({ name: 'Drama', price: 3 });
  await assert.rejects(useCases.createGenre({ name: ' Terror ', price: 2 }), { status: 409 });
  await assert.rejects(useCases.updateGenre({ id: drama.id, name: 'Terror' }), { status: 409 });
});

test('un género exige nombre y precio válidos', async () => {
  const { useCases } = setup();
  await assert.rejects(useCases.createGenre({ name: ' ', price: 2 }), { status: 400 });
  await assert.rejects(useCases.createGenre({ name: 'Terror', price: -1 }), { status: 400 });
});
