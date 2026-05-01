const genreRepo = require('../../../infrastructure/db/genreRepo');

module.exports = async function deleteGenre({ id }) {
    const genre = await genreRepo.findById(id);
    if (!genre) throw Object.assign(new Error('Género no encontrado'), { status: 404 });

    await genreRepo.delete(id);
    return { message: 'Género eliminado correctamente' };
};
