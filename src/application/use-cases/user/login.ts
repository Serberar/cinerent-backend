import { unauthorized, forbidden } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const login = ({ userRepo, passwordHasher, tokenService }: Pick<Deps, 'userRepo' | 'passwordHasher' | 'tokenService'>) => async ({ email, password }: { email: string; password: string }) => {
  const user = await userRepo.findByEmail(email);
  if (!user || !(await passwordHasher.compare(password, user.passwordHash))) throw unauthorized('Credenciales invalidas');
  if (!user.isEmailVerified) throw forbidden('Verifica tu email antes de entrar');
  if (user.suspended) throw forbidden(`Cuenta suspendida${user.suspensionNote ? ': ' + user.suspensionNote : ''}`);

  const { id, firstName, lastName, role } = user;
  return { token: tokenService.sign(id), user: { id, firstName, lastName, role } };
};
