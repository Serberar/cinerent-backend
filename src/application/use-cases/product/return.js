const { badRequest, forbidden, notFound } = require('../../../domain/errors');

module.exports = ({ productRepo, userRepo, emailSender, logger }) => async function returnMovie({ userId, productId }) {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (!user.isEmailVerified) throw forbidden('Verifica tu email antes de entrar');

  const rental = await productRepo.findById(productId);
  // Un alquiler ajeno se trata como inexistente para no revelar que existe
  if (!rental || !rental.belongsTo(userId)) throw notFound('Alquiler no encontrado');
  if (!rental.isActive()) throw badRequest('La pelicula ya esta devuelta');

  rental.markAsReturned();
  await productRepo.update(rental);
  emailSender.send(user.email, 'returnConfirmation', { movieTitle: rental.movieTitle, returnedAt: rental.returnedAt })
    .catch((error) => logger.error('Email returnConfirmation fallido:', error.message));

  return { rent: rental };
};
