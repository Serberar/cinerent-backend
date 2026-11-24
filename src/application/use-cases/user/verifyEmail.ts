import { badRequest } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const verifyEmail = ({ userRepo }: Pick<Deps, 'userRepo'>) => async ({ token }: { token: string }) => {
  const user = await userRepo.findByVerificationToken(token);
  if (!user || user.isVerificationTokenExpired()) throw badRequest('Token de verificacion invalido o expirado');

  user.verifyEmail();
  await userRepo.update(user);

  return { message: 'Email verificado correctamente' };
};
