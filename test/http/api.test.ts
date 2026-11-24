import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../../src/infrastructure/http/app';
import { setup, REGISTER } from '../helpers';

let ctx: ReturnType<typeof setup>;
let server: Server;
let base: string;

const FRONT = 'http://front.test';
const portOf = (s: Server) => (s.address() as AddressInfo).port;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- cuerpos de respuesta de cualquier ruta
async function call(method: string, path: string, { body, session, origin = FRONT }: { body?: unknown; session?: string; origin?: string } = {}): Promise<{ status: number; body: any; cookie: string | null }> {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: origin, ...(session && { Cookie: `cinerent_session=${session}` }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json(), cookie: res.headers.get('set-cookie') };
}

before(async () => {
  ctx = setup();
  const app = createApp({ useCases: ctx.useCases, frontendUrl: FRONT, logger: { error() {} } });
  await new Promise<void>((resolve) => { server = app.listen(0, () => resolve()); });
  base = `http://127.0.0.1:${portOf(server)}`;
});
after(() => { server.close(); });

test('health responde', async () => {
  const { status, body } = await call('GET', '/health');
  assert.deepEqual({ status, body }, { status: 200, body: { status: 'ok' } });
});

test('el registro exige todos los campos y que sean textos', async () => {
  assert.equal((await call('POST', '/api/user/register', { body: {} })).status, 400);
  assert.equal((await call('POST', '/api/user/register', { body: { ...REGISTER, email: { $ne: '' } } })).status, 400);
  assert.equal((await call('POST', '/api/user/register', { body: REGISTER })).status, 201);
});

test('las rutas privadas exigen sesión', async () => {
  assert.equal((await call('GET', '/api/user/me')).status, 401);
  assert.equal((await call('GET', '/api/user/me', { session: 'falso' })).status, 401);
});

test('las rutas de administración exigen el rol', async () => {
  const user = ctx.addUser({ email: 'user@example.com' });
  const admin = ctx.addUser({ email: 'admin@example.com', role: 'ADMIN' });
  assert.equal((await call('GET', '/api/admin/lista-de-usuarios', { session: `token:${user.id}` })).status, 403);
  assert.equal((await call('GET', '/api/admin/lista-de-usuarios', { session: `token:${admin.id}` })).status, 200);
});

test('flujo completo: alquilar, consultar y devolver', async () => {
  const session = `token:${ctx.addUser({ email: 'flujo@example.com' }).id}`;
  const rented = await call('POST', '/api/product/rent', { session, body: { movieId: ctx.addMovie().id, dias: 2 } });
  assert.equal(rented.status, 201);
  assert.equal(rented.body.total, 4);
  assert.equal((await call('GET', '/api/product/history', { session })).body.length, 1);
  assert.equal((await call('PATCH', `/api/product/${rented.body.alquiler.id}/return`, { session })).status, 200);
});

test('demasiados intentos de login se frenan', async () => {
  const app = createApp({ useCases: ctx.useCases, frontendUrl: 'x', maxAuthAttempts: 2, logger: { error() {} } });
  const other = await new Promise<Server>((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const login = () => fetch(`http://127.0.0.1:${portOf(other)}/api/user/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'nadie@example.com', password: 'mal' }),
  }).then((res) => res.status);
  assert.deepEqual([await login(), await login(), await login()], [401, 401, 429]);
  other.close();
});

test('los errores internos no se muestran al cliente', async () => {
  const app = createApp({
    useCases: { ...ctx.useCases, listGenres: async () => { throw new Error('conexión a la base de datos: secreto'); } },
    frontendUrl: 'x', logger: { error() {} },
  });
  const other = await new Promise<Server>((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const res = await fetch(`http://127.0.0.1:${portOf(other)}/api/genre`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'Error interno del servidor' });
  other.close();
});

test('entrar deja una cookie que JavaScript no puede leer y no devuelve el token', async () => {
  const user = ctx.addUser({ email: 'cookie@example.com' });
  const { status, body, cookie } = await call('POST', '/api/user/login', { body: { email: user.email, password: 'secreta-1' } });
  assert.equal(status, 200);
  assert.deepEqual(body, { user: { id: user.id, firstName: 'Ana', lastName: 'Ruiz', role: 'USER' } });
  assert.match(cookie ?? '', /HttpOnly/);
  assert.match(cookie ?? '', /SameSite=Lax/);
  assert.equal((await call('GET', '/api/user/me', { session: /cinerent_session=([^;]+)/.exec(cookie ?? '')?.[1] })).status, 200);
});

test('salir borra la cookie', async () => {
  assert.match((await call('POST', '/api/user/logout')).cookie ?? '', /cinerent_session=;.*Expires=Thu, 01 Jan 1970/);
});

test('un cambio pedido desde otra web se rechaza', async () => {
  const session = `token:${ctx.addUser({ email: 'csrf@example.com' }).id}`;
  const evil = { session, origin: 'http://evil.test', body: { firstName: 'Otra' } };
  assert.equal((await call('PATCH', '/api/user/me', evil)).status, 403);
  assert.equal((await call('PATCH', '/api/user/me', { ...evil, origin: FRONT })).status, 200);
});

test('los datos con un tipo inesperado se ignoran o se rechazan', async () => {
  const session = `token:${ctx.addUser({ email: 'tipos@example.com', role: 'ADMIN' }).id}`;
  const movie = { movieTitle: 'X', desc: 'Y' };
  assert.equal((await call('POST', '/api/movie/create-a-new-movie', { session, body: { ...movie, genreIds: 'abc' } })).status, 400);
  assert.equal((await call('POST', '/api/movie/create-a-new-movie', { session, body: { ...movie, director: { $ne: 1 }, year: 'x' } })).body.director, null);
});
