const { forbidden, notFound } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function suspendUser({ userId, note }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se puede suspender a un administrador');

  if (user.suspended) user.unsuspend();
  else user.suspend(note);
  await userRepo.updateSuspension(user);

  return { id: user.id, suspended: user.suspended, suspensionNote: user.suspensionNote };
};
