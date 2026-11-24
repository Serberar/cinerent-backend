const { notFound } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function getUserDetail({ userId }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  const { id, firstName, lastName, phone, address, email, createdAt } = user;
  return { id, firstName, lastName, phone, address, email, createdAt };
};
