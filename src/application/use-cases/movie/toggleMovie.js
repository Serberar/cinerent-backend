const movieRepo = require('../../../infrastructure/db/movieRepo');

module.exports = async function toggleMovie({ id }) {
    const movie = await movieRepo.findById(id);
    if (!movie) throw Object.assign(new Error('Película no encontrada'), { status: 404 });

    movie.toggleActive();
    await movieRepo.toggle(movie);

    return { id: movie.id, movieTitle: movie.movieTitle, active: movie.active };
};
