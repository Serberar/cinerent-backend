const { notFound } = require('../../../domain/errors');

module.exports = ({ movieRepo }) => async function toggleMovie({ id }) {
  const movie = await movieRepo.findById(id);
  if (!movie) throw notFound('Película no encontrada');

  movie.toggleActive();
  await movieRepo.toggle(movie);
  return { id: movie.id, movieTitle: movie.movieTitle, active: movie.active };
};
