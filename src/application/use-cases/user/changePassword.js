const { badRequest, notFound, unauthorized } = require('../../../domain/errors');

module.exports = ({ userRepo, passwordHasher }) => async function changePassword({ userId, currentPassword, newPassword }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (!(await passwordHasher.compare(currentPassword, user.passwordHash))) throw unauthorized('La contraseña actual no es correcta');
  if (newPassword.length < 6) throw badRequest('La nueva contraseña debe tener al menos 6 caracteres');

  await userRepo.updatePassword({ id: userId, passwordHash: await passwordHasher.hash(newPassword) });
  return { ok: true };
};
