const { notFound } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function getProfile({ userId }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  const { id, firstName, lastName, dni, phone, address, email, isEmailVerified, role, cardLast4 } = user;
  return { id, firstName, lastName, dni, phone, address, email, isEmailVerified, role, cardLast4 };
};
