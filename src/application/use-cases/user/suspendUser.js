const userRepo = require('../../../infrastructure/db/userRepo');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function suspendUser({ userId, note }) {
    const user = await userRepo.findById(userId);
    if (!user) throw err('Usuario no encontrado', 404);
    if (user.role === 'ADMIN') throw err('No se puede suspender a un administrador', 403);

    if (user.suspended) {
        user.unsuspend();
    } else {
        user.suspend(note);
    }

    await userRepo.updateSuspension(user);

    return { id: user.id, suspended: user.suspended, suspensionNote: user.suspensionNote };
};
