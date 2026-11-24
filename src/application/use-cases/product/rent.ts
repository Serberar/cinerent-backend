import { Product } from '../../../domain/Product';
import { conflict, forbidden, notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const rent = ({ productRepo, movieRepo, userRepo, emailSender, logger }: Pick<Deps, 'productRepo' | 'movieRepo' | 'userRepo' | 'emailSender' | 'logger'>) => async ({ userId, movieId, dias }: { userId: string; movieId: string; dias: number }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (!user.isEmailVerified) throw forbidden('Verifica tu email antes de entrar');

  const movie = await movieRepo.findById(movieId);
  if (!movie || !movie.active) throw notFound('Película no encontrada');

  const rentals = await productRepo.findByUser(userId);
  if (rentals.some((rental) => rental.movieId === movieId && rental.isActive())) {
    throw conflict('Error ya tienes alquilada la pelicula');
  }

  const rental = Product.create({ userId, movieId, movieTitle: movie.movieTitle, dias });
  await productRepo.create(rental);
  const total = rental.total(movie.pricePerDay());

  // El alquiler ya está hecho: un fallo del correo no debe deshacerlo
  emailSender.send(user.email, 'rentConfirmation', { movieTitle: rental.movieTitle, dias: rental.dias, total })
    .catch((error: Error) => logger.error('Email rentConfirmation fallido:', error.message));

  return { alquiler: rental, total };
};
