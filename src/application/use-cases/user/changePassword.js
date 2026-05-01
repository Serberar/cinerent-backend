const bcrypt   = require('bcryptjs');
const userRepo = require('../../../infrastructure/db/userRepo');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function changePassword({ userId, currentPassword, newPassword }) {
    const user = await userRepo.findById(userId);
    if (!user) throw err('Usuario no encontrado', 404);

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw err('La contraseña actual no es correcta', 401);

    if (newPassword.length < 6) throw err('La nueva contraseña debe tener al menos 6 caracteres', 400);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userRepo.updatePassword({ id: userId, passwordHash });

    return { ok: true };
};
