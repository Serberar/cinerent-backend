const assertPassword = require('../../../domain/password');
const { forbidden, notFound } = require('../../../domain/errors');

module.exports = ({ userRepo, passwordHasher }) => async function resetUserPassword({ userId, newPassword }) {
  assertPassword(newPassword);

  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se puede cambiar la contraseña de un administrador');

  await userRepo.updatePassword({ id: userId, passwordHash: await passwordHasher.hash(newPassword) });
  return { ok: true };
};
