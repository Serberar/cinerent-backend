const { conflict, notFound } = require('../../../domain/errors');

module.exports = ({ genreRepo }) => async function updateGenre({ id, name, price }) {
  const genre = await genreRepo.findById(id);
  if (!genre) throw notFound('Género no encontrado');

  genre.update({ name, price });
  const sameName = await genreRepo.findByName(genre.name);
  if (sameName && sameName.id !== id) throw conflict('Ya existe un género con ese nombre');
  return genreRepo.update(genre);
};
