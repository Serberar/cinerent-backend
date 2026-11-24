const { notFound } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function updateCard({ userId, cardNumber }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  user.updateCard(cardNumber);
  await userRepo.updateCard(user);

  return { message: 'Tarjeta actualizada correctamente' };
};
