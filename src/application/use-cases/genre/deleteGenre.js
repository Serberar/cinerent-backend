const { notFound } = require('../../../domain/errors');

module.exports = ({ genreRepo }) => async function deleteGenre({ id }) {
  if (!(await genreRepo.findById(id))) throw notFound('Género no encontrado');
  await genreRepo.delete(id);
  return { message: 'Género eliminado correctamente' };
};
