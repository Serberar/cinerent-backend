import { forbidden, notFound } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const suspendUser = ({ userRepo }: Pick<Deps, 'userRepo'>) => async ({ userId, note }: { userId: string; note?: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se puede suspender a un administrador');

  if (user.suspended) user.unsuspend();
  else user.suspend(note);
  await userRepo.updateSuspension(user);

  return { id: user.id, suspended: user.suspended, suspensionNote: user.suspensionNote };
};
