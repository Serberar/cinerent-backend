const { unauthorized, forbidden } = require('../../../domain/errors');

module.exports = ({ userRepo, tokenService }) => async function authenticate({ token }) {
  let userId;
  try {
    userId = tokenService.verify(token);
  } catch {
    throw unauthorized('Token invalido o expirado');
  }

  const user = await userRepo.findById(userId);
  if (!user) throw unauthorized('Token invalido o expirado');
  if (user.suspended) throw forbidden('Cuenta suspendida');

  return { id: user.id, role: user.role };
};
