import { notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const getProfile = ({ userRepo }: Pick<Deps, 'userRepo'>) => async ({ userId }: { userId: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  const { id, firstName, lastName, dni, phone, address, email, isEmailVerified, role, cardLast4 } = user;
  return { id, firstName, lastName, dni, phone, address, email, isEmailVerified, role, cardLast4 };
};
