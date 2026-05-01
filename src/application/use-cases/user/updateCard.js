const userRepo = require('../../../infrastructure/db/userRepo');

module.exports = async function updateCard({ userId, cardNumber }) {
    const user = await userRepo.findById(userId);
    if (!user) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });

    user.updateCard(cardNumber);
    await userRepo.updateCard(user);

    return { message: 'Tarjeta actualizada correctamente' };
};
