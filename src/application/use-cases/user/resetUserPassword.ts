import { assertPassword } from '../../../domain/password';
import { forbidden, notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const resetUserPassword = ({ userRepo, passwordHasher }: Pick<Deps, 'userRepo' | 'passwordHasher'>) => async ({ userId, newPassword }: { userId: string; newPassword: unknown }) => {
  assertPassword(newPassword);

  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se puede cambiar la contraseña de un administrador');

  await userRepo.updatePassword({ id: userId, passwordHash: await passwordHasher.hash(newPassword) });
  return { ok: true };
};
