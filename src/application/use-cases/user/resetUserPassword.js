const { badRequest, forbidden, notFound } = require('../../../domain/errors');

module.exports = ({ userRepo, passwordHasher }) => async function resetUserPassword({ userId, newPassword }) {
  if (!newPassword || newPassword.length < 6) throw badRequest('La contraseña debe tener al menos 6 caracteres');

  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se puede cambiar la contraseña de un administrador');

  await userRepo.updatePassword({ id: userId, passwordHash: await passwordHasher.hash(newPassword) });
  return { ok: true };
};
