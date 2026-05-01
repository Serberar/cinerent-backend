const movieRepo = require('../../../infrastructure/db/movieRepo');

module.exports = async function updateMovie({ id, movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds }) {
    const movie = await movieRepo.findById(id);
    if (!movie) throw Object.assign(new Error('Película no encontrada'), { status: 404 });

    movie.updateMovie({ movieTitle, desc, year, posterUrl, director, actors, runtime });
    return movieRepo.update(movie, genreIds);
};
