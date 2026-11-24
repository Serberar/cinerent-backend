module.exports = ({ movieRepo }) => async function getFeaturedMovies() {
  return movieRepo.findFeatured();
};
