const { Movie } = require('../../../domain/Movie');
const movieRepo = require('../../../infrastructure/db/movieRepo');

module.exports = async function createMovie({ movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds = [] }) {
    const movie = Movie.create({ movieTitle, desc, year, posterUrl, director, actors, runtime });
    return movieRepo.create(movie, genreIds);
};
