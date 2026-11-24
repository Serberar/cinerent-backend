const { notFound } = require('../../../domain/errors');

module.exports = ({ movieRepo }) => async function updateMovie({ id, genreIds, ...data }) {
  const movie = await movieRepo.findById(id);
  if (!movie) throw notFound('Película no encontrada');

  movie.updateMovie(data);
  return movieRepo.update(movie, genreIds);
};
