import { User, type NewUser } from '../../../domain/User';
import { assertPassword } from '../../../domain/password';
import { conflict } from '../../../domain/errors';
import type { Deps } from '../../ports';

export const register = ({ userRepo, passwordHasher, emailSender, frontendUrl }: Pick<Deps, 'userRepo' | 'passwordHasher' | 'emailSender' | 'frontendUrl'>) => async ({ password, ...data }: Omit<NewUser, 'passwordHash'> & { password: string }) => {
  assertPassword(password);
  if (await userRepo.findByEmail(data.email)) throw conflict(`El usuario '${data.email}' ya existe`);

  const passwordHash = await passwordHasher.hash(password);
  const user = User.create({ ...data, passwordHash });

  await userRepo.create(user);
  const url = `${frontendUrl}/verify-email?token=${user.emailVerificationToken}`;
  await emailSender.send(user.email, 'verifyEmail', { url });

  return { id: user.id, email: user.email };
};
