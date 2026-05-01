const movieRepo = require('../../../infrastructure/db/movieRepo');

module.exports = async function listMovies() {
    const movieList = await movieRepo.findAll();
    return { movieList };
};
