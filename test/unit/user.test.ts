import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AppError } from '../../src/domain/errors';
import { setup, REGISTER } from '../helpers';

test('el registro guarda solo los cuatro últimos dígitos de la tarjeta', async () => {
  const { useCases, users } = setup();
  const { id } = await useCases.register(REGISTER);
  const user = users.rows.get(id);
  assert.ok(user);
  assert.equal(user.cardLast4, '1234');
  assert.ok(!JSON.stringify(user).includes('4111111111111234'));
});

test('el registro normaliza el email y envía el enlace de verificación', async () => {
  const { useCases, users, sent } = setup();
  const { id } = await useCases.register(REGISTER);
  const user = users.rows.get(id);
  assert.ok(user);
  assert.equal(user.email, 'ana@example.com');
  assert.equal(sent[0]?.template, 'verifyEmail');
  assert.deepEqual(sent[0]?.data, { url: `http://front.test/verify-email?token=${user.emailVerificationToken}` });
});

test('no se puede registrar dos veces el mismo email', async () => {
  const { useCases } = setup();
  await useCases.register(REGISTER);
  await assert.rejects(useCases.register(REGISTER), { status: 409 });
});

test('una tarjeta sin 16 dígitos se rechaza', async () => {
  const { useCases } = setup();
  await assert.rejects(useCases.register({ ...REGISTER, cardNumber: '1234' }), { status: 400 });
  await assert.rejects(useCases.register({ ...REGISTER, cardNumber: 'abcdabcdabcdabcd' }), { status: 400 });
});

test('una contraseña corta se rechaza', async () => {
  const { useCases } = setup();
  await assert.rejects(useCases.register({ ...REGISTER, password: '123' }), { status: 400 });
});

test('no se entra hasta verificar el email', async () => {
  const { useCases, users } = setup();
  const { id } = await useCases.register(REGISTER);
  const credentials = { email: REGISTER.email, password: REGISTER.password };
  await assert.rejects(useCases.login(credentials), { status: 403 });
  await useCases.verifyEmail({ token: users.rows.get(id)?.emailVerificationToken ?? '' });
  const { token, user } = await useCases.login(credentials);
  assert.equal(token, `token:${id}`);
  assert.deepEqual(user, { id, firstName: 'Ana', lastName: 'Ruiz', role: 'USER' });
});

test('un enlace de verificación caducado no sirve', async () => {
  const { useCases, users } = setup();
  const { id } = await useCases.register(REGISTER);
  const user = users.rows.get(id);
  assert.ok(user);
  user.emailVerificationTokenExpiresAt = new Date(Date.now() - 1);
  await assert.rejects(useCases.verifyEmail({ token: user.emailVerificationToken ?? '' }), { status: 400 });
});

test('usuario inexistente y contraseña errónea dan el mismo error', async () => {
  const { useCases, addUser } = setup();
  addUser();
  const wrong = await useCases.login({ email: 'ana@example.com', password: 'mal' }).catch((e: unknown) => e as AppError);
  const missing = await useCases.login({ email: 'nadie@example.com', password: 'mal' }).catch((e: unknown) => e as AppError);
  assert.ok(wrong instanceof AppError && missing instanceof AppError);
  assert.equal(wrong.status, 401);
  assert.equal(wrong.message, missing.message);
});

test('un usuario suspendido no entra y su token deja de valer', async () => {
  const { useCases, addUser } = setup();
  const user = addUser();
  await useCases.suspendUser({ userId: user.id, note: 'impago' });
  await assert.rejects(useCases.login({ email: user.email, password: 'secreta-1' }), { status: 403 });
  await assert.rejects(useCases.authenticate({ token: `token:${user.id}` }), { status: 403 });
});

test('un token inválido o de un usuario borrado se rechaza', async () => {
  const { useCases } = setup();
  await assert.rejects(useCases.authenticate({ token: 'falso' }), { status: 401 });
  await assert.rejects(useCases.authenticate({ token: 'token:nadie' }), { status: 401 });
});

test('a un administrador no se le puede suspender, editar ni cambiar la contraseña', async () => {
  const { useCases, addUser } = setup();
  const { id: userId } = addUser({ role: 'ADMIN' });
  await assert.rejects(useCases.suspendUser({ userId }), { status: 403 });
  await assert.rejects(useCases.updateUserAdmin({ userId, firstName: 'X' }), { status: 403 });
  await assert.rejects(useCases.resetUserPassword({ userId, newPassword: 'nueva-clave' }), { status: 403 });
});

test('cambiar la contraseña exige la actual', async () => {
  const { useCases, addUser } = setup();
  const user = addUser();
  await assert.rejects(useCases.changePassword({ userId: user.id, currentPassword: 'mal', newPassword: 'nueva-clave' }), { status: 401 });
  await useCases.changePassword({ userId: user.id, currentPassword: 'secreta-1', newPassword: 'nueva-clave' });
  assert.equal(user.passwordHash, 'hash:nueva-clave');
});

test('el perfil y el listado no exponen el hash de la contraseña', async () => {
  const { useCases, addUser } = setup();
  const user = addUser();
  const output = JSON.stringify([await useCases.getProfile({ userId: user.id }), await useCases.listUsers()]);
  assert.ok(!output.includes('hash:'));
});
