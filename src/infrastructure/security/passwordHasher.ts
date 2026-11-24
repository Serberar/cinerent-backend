import bcrypt from 'bcryptjs';
import type { PasswordHasher } from '../../application/ports';

export const passwordHasher: PasswordHasher = {
  hash: (password) => bcrypt.hash(password, 12),
  compare: (password, hash) => bcrypt.compare(password, hash),
};
