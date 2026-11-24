module.exports = ({ productRepo, userRepo, emailSender, logger }) => async function returnExpired({ now = new Date() } = {}) {
  const expired = (await productRepo.findAllActive()).filter((rental) => rental.isExpired(now));

  for (const rental of expired) {
    rental.markAsReturned();
    await productRepo.update(rental);

    const user = await userRepo.findById(rental.userId);
    if (!user) continue;
    const returnedAt = rental.returnedAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    await emailSender.send(user.email, 'returnConfirmation', { movieTitle: rental.movieTitle, returnedAt })
      .catch((error) => logger.error('Email returnConfirmation fallido:', error.message));
  }

  return { returned: expired.length };
};
