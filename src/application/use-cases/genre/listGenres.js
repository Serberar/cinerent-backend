const genreRepo = require('../../../infrastructure/db/genreRepo');

module.exports = async function listGenres() {
    const genres = await genreRepo.findAll();
    return genres;
};
