const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../../src/infrastructure/http/app');
const { setup, REGISTER } = require('../helpers');

let ctx; let server; let base;
const call = async (method, path, { body, token } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
};

before(async () => {
  ctx = setup();
  const app = createApp({ useCases: ctx.useCases, frontendUrl: 'http://front.test', logger: { error() {} } });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test('health responde', async () => {
  assert.deepEqual(await call('GET', '/health'), { status: 200, body: { status: 'ok' } });
});

test('el registro exige todos los campos y que sean textos', async () => {
  assert.equal((await call('POST', '/api/user/register', { body: {} })).status, 400);
  assert.equal((await call('POST', '/api/user/register', { body: { ...REGISTER, email: { $ne: '' } } })).status, 400);
  assert.equal((await call('POST', '/api/user/register', { body: REGISTER })).status, 201);
});

test('las rutas privadas exigen token', async () => {
  assert.equal((await call('GET', '/api/user/me')).status, 401);
  assert.equal((await call('GET', '/api/user/me', { token: 'falso' })).status, 401);
});

test('las rutas de administración exigen el rol', async () => {
  const user = ctx.addUser({ email: 'user@example.com' });
  const admin = ctx.addUser({ email: 'admin@example.com', role: 'ADMIN' });
  assert.equal((await call('GET', '/api/admin/lista-de-usuarios', { token: `token:${user.id}` })).status, 403);
  assert.equal((await call('GET', '/api/admin/lista-de-usuarios', { token: `token:${admin.id}` })).status, 200);
});

test('flujo completo: alquilar, consultar y devolver', async () => {
  const token = `token:${ctx.addUser({ email: 'flujo@example.com' }).id}`;
  const rented = await call('POST', '/api/product/rent', { token, body: { movieId: ctx.addMovie().id, dias: 2 } });
  assert.equal(rented.status, 201);
  assert.equal(rented.body.total, 4);
  assert.equal((await call('GET', '/api/product/history', { token })).body.length, 1);
  assert.equal((await call('PATCH', `/api/product/${rented.body.alquiler.id}/return`, { token })).status, 200);
});

test('los errores internos no se muestran al cliente', async () => {
  const app = createApp({
    useCases: { listGenres: async () => { throw new Error('conexión a la base de datos: secreto'); } },
    frontendUrl: 'x', logger: { error() {} },
  });
  const other = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const res = await fetch(`http://127.0.0.1:${other.address().port}/api/genre`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'Error interno del servidor' });
  other.close();
});
