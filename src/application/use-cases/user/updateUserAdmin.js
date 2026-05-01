const userRepo = require('../../../infrastructure/db/userRepo');

const err = (msg, status) => Object.assign(new Error(msg), { status });

module.exports = async function updateUserAdmin({ userId, firstName, lastName, phone, address }) {
    const user = await userRepo.findById(userId);
    if (!user) throw err('Usuario no encontrado', 404);
    if (user.role === 'ADMIN') throw err('No se pueden modificar datos de un administrador', 403);

    user.updateProfile({ firstName, lastName, phone, address });
    await userRepo.updateProfile(user);

    return {
        id:        user.id,
        firstName: user.firstName,
        lastName:  user.lastName,
        phone:     user.phone,
        address:   user.address,
        email:     user.email,
    };
};
