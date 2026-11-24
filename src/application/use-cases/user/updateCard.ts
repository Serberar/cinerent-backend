import { notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const updateCard = ({ userRepo }: Pick<Deps, 'userRepo'>) => async ({ userId, cardNumber }: { userId: string; cardNumber: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  user.updateCard(cardNumber);
  await userRepo.updateCard(user);

  return { message: 'Tarjeta actualizada correctamente' };
};
