import type { User as UserRow } from '@prisma/client';
import type { UserRepo } from '../../application/ports';
import { User } from '../../domain/User';
import { db } from './client';

const toUser = (row: UserRow) => new User(row);
const orNull = (row: UserRow | null) => (row ? toUser(row) : null);

export const userRepo: UserRepo = {
  findById: async (id) => orNull(await db.user.findUnique({ where: { id } })),
  findByEmail: async (email) => orNull(await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })),
  findByVerificationToken: async (token) => orNull(await db.user.findUnique({ where: { emailVerificationToken: token } })),
  findAll: async () => (await db.user.findMany()).map(toUser),

  create: ({ id, firstName, lastName, dni, phone, address, cardLast4, email, passwordHash, isEmailVerified,
    emailVerificationToken, emailVerificationTokenExpiresAt }) => db.user.create({
    data: {
      id, firstName, lastName, dni, phone, address, cardLast4, email, passwordHash, isEmailVerified,
      emailVerificationToken, emailVerificationTokenExpiresAt,
    },
  }),
  update: ({ id, isEmailVerified, emailVerificationToken, emailVerificationTokenExpiresAt, updatedAt }) => db.user.update({
    where: { id }, data: { isEmailVerified, emailVerificationToken, emailVerificationTokenExpiresAt, updatedAt },
  }),
  updateProfile: ({ id, firstName, lastName, phone, address, updatedAt }) => db.user.update({
    where: { id }, data: { firstName, lastName, phone, address, updatedAt },
  }),
  updateCard: ({ id, cardLast4, updatedAt }) => db.user.update({ where: { id }, data: { cardLast4, updatedAt } }),
  updatePassword: ({ id, passwordHash }) => db.user.update({ where: { id }, data: { passwordHash, updatedAt: new Date() } }),
  updateSuspension: ({ id, suspended, suspensionNote, updatedAt }) => db.user.update({
    where: { id }, data: { suspended, suspensionNote, updatedAt },
  }),
};
