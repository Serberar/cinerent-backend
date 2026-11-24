import { notFound, forbidden } from '../../../domain/errors';
import type { Profile } from '../../../domain/User';
import type { Deps } from '../../ports';

export const updateUserAdmin = ({ userRepo }: Pick<Deps, 'userRepo'>) => async ({ userId, ...profile }: Partial<Profile> & { userId: string }) => {
  const user = await userRepo.findById(userId);
  if (!user) throw notFound('Usuario no encontrado');
  if (user.role === 'ADMIN') throw forbidden('No se pueden modificar datos de un administrador');

  user.updateProfile(profile);
  await userRepo.updateProfile(user);

  return { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address, email: user.email };
};
