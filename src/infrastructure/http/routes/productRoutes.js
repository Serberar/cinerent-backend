const { Router } = require('express');
const handle = require('../handler');
const requireText = require('../validate');

module.exports = ({ useCases, auth }) => {
  const router = Router();

  router.post('/rent', auth, handle((req) => {
    const { movieId } = requireText(req.body, ['movieId'], 'movieId y dias son requeridos');
    return useCases.rent({ userId: req.user.id, movieId, dias: Number(req.body.dias) });
  }, 201));
  router.patch('/:id/return', auth, handle((req) => useCases.returnMovie({ userId: req.user.id, productId: req.params.id })));
  router.get('/history', auth, handle((req) => useCases.listHistory({ userId: req.user.id })));

  return router;
};
