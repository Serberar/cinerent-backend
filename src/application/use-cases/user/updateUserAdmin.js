const { notFound, forbidden } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function updateUserAdmin({ userId, firstName, lastName, phone, address }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se pueden modificar datos de un administrador');

  user.updateProfile({ firstName, lastName, phone, address });
  await userRepo.updateProfile(user);

  return { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address, email: user.email };
};
