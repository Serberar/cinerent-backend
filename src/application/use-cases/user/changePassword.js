const assertPassword = require('../../../domain/password');
const { notFound, unauthorized } = require('../../../domain/errors');

module.exports = ({ userRepo, passwordHasher }) => async function changePassword({ userId, currentPassword, newPassword }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (!(await passwordHasher.compare(currentPassword, user.passwordHash))) throw unauthorized('La contraseña actual no es correcta');
  assertPassword(newPassword);

  await userRepo.updatePassword({ id: userId, passwordHash: await passwordHasher.hash(newPassword) });
  return { ok: true };
};
