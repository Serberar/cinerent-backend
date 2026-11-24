import { badRequest, forbidden, notFound } from '../../../domain/errors';

import { formatDate } from '../../formatDate';
import type { Deps } from '../../ports';

export const returnMovie = ({ productRepo, userRepo, emailSender, logger }: Pick<Deps, 'productRepo' | 'userRepo' | 'emailSender' | 'logger'>) => async ({ userId, productId }: { userId: string; productId: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (!user.isEmailVerified) throw forbidden('Verifica tu email antes de entrar');

  const rental = await productRepo.findById(productId);
  // Un alquiler ajeno se trata como inexistente para no revelar que existe
  if (!rental || !rental.belongsTo(userId)) throw notFound('Alquiler no encontrado');
  if (!rental.isActive()) throw badRequest('La pelicula ya esta devuelta');

  const returnedAt = formatDate(rental.markAsReturned());
  await productRepo.update(rental);
  emailSender.send(user.email, 'returnConfirmation', { movieTitle: rental.movieTitle, returnedAt })
    .catch((error: Error) => logger.error('Email returnConfirmation fallido:', error.message));

  return { rent: rental };
};
