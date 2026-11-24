const { Router } = require('express');
const handle = require('../handler');
const requireText = require('../validate');

const movieData = ({ movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds } = {}) => (
  { movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds }
);

module.exports = ({ useCases, auth, admin }) => {
  const router = Router();

  router.get('/all-movies', handle(() => useCases.listMovies()));
  router.get('/featured', handle(() => useCases.getFeaturedMovies()));
  router.post('/create-a-new-movie', auth, admin, handle((req) => {
    requireText(req.body, ['movieTitle', 'desc'], 'El título y la descripción son requeridos');
    return useCases.createMovie(movieData(req.body));
  }, 201));
  router.put('/:id', auth, admin, handle((req) => useCases.updateMovie({ ...movieData(req.body), id: req.params.id })));
  router.patch('/:id/toggle', auth, admin, handle((req) => useCases.toggleMovie({ id: req.params.id })));
  router.patch('/:id/toggle-featured', auth, admin, handle((req) => useCases.toggleFeaturedMovie({ id: req.params.id })));

  return router;
};
