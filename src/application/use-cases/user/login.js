const { unauthorized, forbidden } = require('../../../domain/errors');

module.exports = ({ userRepo, passwordHasher, tokenService }) => async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user || !(await passwordHasher.compare(password, user.passwordHash))) throw unauthorized('Credenciales invalidas');
  if (!user.isEmailVerified) throw forbidden('Verifica tu email antes de entrar');
  if (user.suspended) throw forbidden(`Cuenta suspendida${user.suspensionNote ? ': ' + user.suspensionNote : ''}`);

  return { token: tokenService.sign(user.id) };
};
