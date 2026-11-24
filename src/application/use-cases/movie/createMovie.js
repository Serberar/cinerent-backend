const { Movie } = require('../../../domain/Movie');

module.exports = ({ movieRepo }) => async function createMovie({ genreIds = [], ...data }) {
  return movieRepo.create(Movie.create(data), genreIds);
};
