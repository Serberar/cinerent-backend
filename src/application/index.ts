// Construye todos los casos de uso con sus dependencias. La aplicación solo conoce puertos, nunca Express ni Prisma.
import { createGenre } from './use-cases/genre/createGenre';
import { deleteGenre } from './use-cases/genre/deleteGenre';
import { listGenres } from './use-cases/genre/listGenres';
import { updateGenre } from './use-cases/genre/updateGenre';
import { createMovie } from './use-cases/movie/createMovie';
import { getFeaturedMovies } from './use-cases/movie/getFeaturedMovies';
import { listAllMovies } from './use-cases/movie/listAllMovies';
import { listMovies } from './use-cases/movie/listMovies';
import { toggleFeaturedMovie } from './use-cases/movie/toggleFeaturedMovie';
import { toggleMovie } from './use-cases/movie/toggleMovie';
import { updateMovie } from './use-cases/movie/updateMovie';
import { listActive } from './use-cases/product/listActive';
import { listHistory } from './use-cases/product/listHistory';
import { rent } from './use-cases/product/rent';
import { returnMovie } from './use-cases/product/return';
import { returnExpired } from './use-cases/product/returnExpired';
import { authenticate } from './use-cases/user/authenticate';
import { changePassword } from './use-cases/user/changePassword';
import { getProfile } from './use-cases/user/getProfile';
import { getUserDetail } from './use-cases/user/getUserDetail';
import { listUsers } from './use-cases/user/listUsers';
import { login } from './use-cases/user/login';
import { register } from './use-cases/user/register';
import { resetUserPassword } from './use-cases/user/resetUserPassword';
import { suspendUser } from './use-cases/user/suspendUser';
import { updateCard } from './use-cases/user/updateCard';
import { updateUser } from './use-cases/user/updateUser';
import { updateUserAdmin } from './use-cases/user/updateUserAdmin';
import { verifyEmail } from './use-cases/user/verifyEmail';
import type { Deps } from './ports';

export const createUseCases = (deps: Deps) => ({
  createGenre: createGenre(deps),
  deleteGenre: deleteGenre(deps),
  listGenres: listGenres(deps),
  updateGenre: updateGenre(deps),
  createMovie: createMovie(deps),
  getFeaturedMovies: getFeaturedMovies(deps),
  listAllMovies: listAllMovies(deps),
  listMovies: listMovies(deps),
  toggleFeaturedMovie: toggleFeaturedMovie(deps),
  toggleMovie: toggleMovie(deps),
  updateMovie: updateMovie(deps),
  listActive: listActive(deps),
  listHistory: listHistory(deps),
  rent: rent(deps),
  returnMovie: returnMovie(deps),
  returnExpired: returnExpired(deps),
  authenticate: authenticate(deps),
  changePassword: changePassword(deps),
  getProfile: getProfile(deps),
  getUserDetail: getUserDetail(deps),
  listUsers: listUsers(deps),
  login: login(deps),
  register: register(deps),
  resetUserPassword: resetUserPassword(deps),
  suspendUser: suspendUser(deps),
  updateCard: updateCard(deps),
  updateUser: updateUser(deps),
  updateUserAdmin: updateUserAdmin(deps),
  verifyEmail: verifyEmail(deps),
});

export type UseCases = ReturnType<typeof createUseCases>;
