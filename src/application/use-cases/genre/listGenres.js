module.exports = ({ genreRepo }) => async function listGenres() {
  return genreRepo.findAll();
};
