const { Genre }  = require('../../../domain/Genre');
const genreRepo  = require('../../../infrastructure/db/genreRepo');

module.exports = async function createGenre({ name, price }) {
    const exists = await genreRepo.findByName(name?.trim());
    if (exists) throw Object.assign(new Error('El género ya existe'), { status: 409 });

    const genre = Genre.create({ name, price });
    return genreRepo.create(genre);
};
