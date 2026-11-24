import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setup } from '../helpers';

const DAY_MS = 24 * 60 * 60 * 1000;

test('alquilar calcula el total y usa el título del catálogo', async () => {
  const { useCases, addUser, addMovie, sent } = setup();
  const { alquiler, total } = await useCases.rent({ userId: addUser().id, movieId: addMovie().id, dias: 3 });
  assert.equal(total, 6);
  assert.equal(alquiler.movieTitle, 'Alien');
  assert.equal(sent[0]?.template, 'rentConfirmation');
});

test('el total usa el precio del género más caro', async () => {
  const { useCases, addUser, addMovie } = setup();
  const movie = addMovie({ genres: [{ id: 'a', name: 'Drama', price: 1.5 }, { id: 'b', name: 'Terror', price: 2.99 }] });
  const { total } = await useCases.rent({ userId: addUser().id, movieId: movie.id, dias: 3 });
  assert.equal(total, 8.97);
});

test('los días deben ser un entero entre 1 y 30', async () => {
  const { useCases, addUser, addMovie } = setup();
  const base = { userId: addUser().id, movieId: addMovie().id };
  for (const dias of [0, -1, 1.5, 31, NaN]) await assert.rejects(useCases.rent({ ...base, dias }), { status: 400 });
});

test('no se puede alquilar dos veces la misma película a la vez', async () => {
  const { useCases, addUser, addMovie } = setup();
  const base = { userId: addUser().id, movieId: addMovie().id, dias: 1 };
  const { alquiler } = await useCases.rent(base);
  await assert.rejects(useCases.rent(base), { status: 409 });
  await useCases.returnMovie({ userId: base.userId, productId: alquiler.id });
  await useCases.rent(base);
});

test('no se alquila una película inexistente o desactivada', async () => {
  const { useCases, addUser, addMovie } = setup();
  const userId = addUser().id;
  const movie = addMovie();
  await useCases.toggleMovie({ id: movie.id });
  await assert.rejects(useCases.rent({ userId, movieId: movie.id, dias: 1 }), { status: 404 });
  await assert.rejects(useCases.rent({ userId, movieId: 'nada', dias: 1 }), { status: 404 });
});

test('nadie puede devolver el alquiler de otro usuario', async () => {
  const { useCases, addUser, addMovie, products } = setup();
  const owner = addUser();
  const other = addUser({ email: 'otro@example.com' });
  const { alquiler } = await useCases.rent({ userId: owner.id, movieId: addMovie().id, dias: 1 });
  await assert.rejects(useCases.returnMovie({ userId: other.id, productId: alquiler.id }), { status: 404 });
  assert.ok(products.rows.get(alquiler.id)?.isActive());
});

test('una película devuelta no se devuelve otra vez', async () => {
  const { useCases, addUser, addMovie } = setup();
  const userId = addUser().id;
  const { alquiler } = await useCases.rent({ userId, movieId: addMovie().id, dias: 1 });
  await useCases.returnMovie({ userId, productId: alquiler.id });
  await assert.rejects(useCases.returnMovie({ userId, productId: alquiler.id }), { status: 400 });
});

test('la devolución automática solo afecta a los alquileres vencidos', async () => {
  const { useCases, addUser, addMovie, products } = setup();
  const userId = addUser().id;
  const { alquiler: short } = await useCases.rent({ userId, movieId: addMovie().id, dias: 1 });
  const { alquiler: long } = await useCases.rent({ userId, movieId: addMovie({ movieTitle: 'Dune' }).id, dias: 10 });
  const { returned } = await useCases.returnExpired({ now: new Date(Date.now() + 2 * DAY_MS) });
  assert.equal(returned, 1);
  assert.ok(!products.rows.get(short.id)?.isActive());
  assert.ok(products.rows.get(long.id)?.isActive());
});
