module.exports = ({ movieRepo }) => async function listAllMovies() {
  return movieRepo.findAllAdmin();
};
