const { badRequest } = require('../../../domain/errors');

module.exports = ({ userRepo }) => async function verifyEmail({ token }) {
  const user = await userRepo.findByVerificationToken(token);
  if (!user || user.isVerificationTokenExpired()) throw badRequest('Token de verificacion invalido o expirado');

  user.verifyEmail();
  await userRepo.update(user);

  return { message: 'Email verificado correctamente' };
};
