import { notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const getUserDetail = ({ userRepo }: Pick<Deps, 'userRepo'>) => async ({ userId }: { userId: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');

  const { id, firstName, lastName, phone, address, email, createdAt } = user;
  return { id, firstName, lastName, phone, address, email, createdAt };
};
