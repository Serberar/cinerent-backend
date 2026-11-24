import { unauthorized, forbidden } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const authenticate = ({ userRepo, tokenService }: Pick<Deps, 'userRepo' | 'tokenService'>) => async ({ token }: { token: string }) => {
  let userId: string;
  try {
    userId = tokenService.verify(token);
  } catch {
    throw unauthorized('Token invalido o expirado');
  }

  const user = await userRepo.findById(userId);
  if (!user) throw unauthorized('Token invalido o expirado');
  if (user.suspended) throw forbidden('Cuenta suspendida');

  return { id: user.id, role: user.role };
};
