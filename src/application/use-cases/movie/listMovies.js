module.exports = ({ movieRepo }) => async function listMovies() {
  return { movieList: await movieRepo.findAll() };
};
