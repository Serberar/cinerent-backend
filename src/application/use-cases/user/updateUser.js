const { notFound } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function updateUser({ userId, firstName, lastName, phone, address }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  user.updateProfile({ firstName, lastName, phone, address });
  await userRepo.updateProfile(user);

  return { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address };
};
