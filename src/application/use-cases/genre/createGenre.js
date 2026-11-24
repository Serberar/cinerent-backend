const { Genre } = require('../../../domain/Genre');
const { conflict } = require('../../../domain/errors');

module.exports = ({ genreRepo }) => async function createGenre({ name, price }) {
  const genre = Genre.create({ name, price });
  if (await genreRepo.findByName(genre.name)) throw conflict('El género ya existe');
  return genreRepo.create(genre);
};
