const movieRepo = require('../../../infrastructure/db/movieRepo');

module.exports = async function toggleFeaturedMovie({ id }) {
    const movie = await movieRepo.findById(id);
    if (!movie) throw Object.assign(new Error('Película no encontrada'), { status: 404 });

    movie.toggleFeatured();
    const updated = await movieRepo.toggleFeatured(movie);

    return { id: updated.id, movieTitle: updated.movieTitle, featured: updated.featured };
};
