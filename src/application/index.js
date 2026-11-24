// Construye todos los casos de uso con sus dependencias. La aplicación solo conoce puertos, nunca Express ni Prisma.
module.exports = function createUseCases(deps) {
  const build = (path) => require(`./use-cases/${path}`)(deps);

  return {
    register: build('user/register'),
    login: build('user/login'),
    verifyEmail: build('user/verifyEmail'),
    authenticate: build('user/authenticate'),
    getProfile: build('user/getProfile'),
    getUserDetail: build('user/getUserDetail'),
    listUsers: build('user/listUsers'),
    updateUser: build('user/updateUser'),
    updateUserAdmin: build('user/updateUserAdmin'),
    updateCard: build('user/updateCard'),
    changePassword: build('user/changePassword'),
    resetUserPassword: build('user/resetUserPassword'),
    suspendUser: build('user/suspendUser'),
    rent: build('product/rent'),
    returnMovie: build('product/return'),
    returnExpired: build('product/returnExpired'),
    listHistory: build('product/listHistory'),
    listActive: build('product/listActive'),
    createMovie: build('movie/createMovie'),
    listMovies: build('movie/listMovies'),
    listAllMovies: build('movie/listAllMovies'),
    getFeaturedMovies: build('movie/getFeaturedMovies'),
    updateMovie: build('movie/updateMovie'),
    toggleMovie: build('movie/toggleMovie'),
    toggleFeaturedMovie: build('movie/toggleFeaturedMovie'),
    listGenres: build('genre/listGenres'),
    createGenre: build('genre/createGenre'),
    updateGenre: build('genre/updateGenre'),
    deleteGenre: build('genre/deleteGenre'),
  };
};
