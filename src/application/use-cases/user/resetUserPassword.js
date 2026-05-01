const bcrypt   = require('bcryptjs');
const userRepo = require('../../../infrastructure/db/userRepo');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function resetUserPassword({ userId, newPassword }) {
    if (!newPassword || newPassword.length < 6)
        throw err('La contraseña debe tener al menos 6 caracteres', 400);

    const user = await userRepo.findById(userId);
    if (!user) throw err('Usuario no encontrado', 404);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userRepo.updatePassword({ id: userId, passwordHash });

    return { ok: true };
};
