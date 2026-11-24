const { User } = require('../../../domain/User');
const assertPassword = require('../../../domain/password');
const { conflict } = require('../../../domain/errors');

module.exports = ({ userRepo, passwordHasher, emailSender, frontendUrl }) => async function register({ firstName, lastName, dni, phone, address, cardNumber, email, password }) {
  assertPassword(password);
  if (await userRepo.findByEmail(email)) throw conflict(`El usuario '${email}' ya existe`);

  const passwordHash = await passwordHasher.hash(password);
  const user = User.create({ firstName, lastName, dni, phone, address, cardNumber, email, passwordHash });

  await userRepo.create(user);
  const url = `${frontendUrl}/verify-email?token=${user.emailVerificationToken}`;
  await emailSender.send(user.email, 'verifyEmail', { url });

  return { id: user.id, email: user.email };
};
