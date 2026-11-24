import { assertPassword } from '../../../domain/password';
import { notFound, unauthorized } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const changePassword = ({ userRepo, passwordHasher }: Pick<Deps, 'userRepo' | 'passwordHasher'>) => async ({ userId, currentPassword, newPassword }: { userId: string; currentPassword: string; newPassword: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (!(await passwordHasher.compare(currentPassword, user.passwordHash))) throw unauthorized('La contraseña actual no es correcta');
  assertPassword(newPassword);

  await userRepo.updatePassword({ id: userId, passwordHash: await passwordHasher.hash(newPassword) });
  return { ok: true };
};
