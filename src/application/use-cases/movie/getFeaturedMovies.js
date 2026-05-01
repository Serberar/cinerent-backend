const movieRepo = require('../../../infrastructure/db/movieRepo');

module.exports = async function getFeaturedMovies() {
    return movieRepo.findFeatured();
};
