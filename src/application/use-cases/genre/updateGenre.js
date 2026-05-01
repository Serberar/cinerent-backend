const genreRepo = require('../../../infrastructure/db/genreRepo');

module.exports = async function updateGenre({ id, name, price }) {
    const genre = await genreRepo.findById(id);
    if (!genre) throw Object.assign(new Error('Género no encontrado'), { status: 404 });

    if (name !== undefined) {
        const exists = await genreRepo.findByName(name?.trim());
        if (exists && exists.id !== id) throw Object.assign(new Error('Ya existe un género con ese nombre'), { status: 409 });
    }

    genre.update({ name, price });
    return genreRepo.update(genre);
};
