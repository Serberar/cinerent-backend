const { notFound } = require('../../../domain/errors');

module.exports = ({ movieRepo }) => async function toggleFeaturedMovie({ id }) {
  const movie = await movieRepo.findById(id);
  if (!movie) throw notFound('Película no encontrada');

  movie.toggleFeatured();
  const updated = await movieRepo.toggleFeatured(movie);
  return { id: updated.id, movieTitle: updated.movieTitle, featured: updated.featured };
};
