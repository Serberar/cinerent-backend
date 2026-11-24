const { Router } = require('express');
const handle = require('../handler');
const requireText = require('../validate');

module.exports = ({ useCases, auth, admin }) => {
  const router = Router();

  router.get('/', handle(() => useCases.listGenres()));
  router.post('/', auth, admin, handle((req) => {
    const { name } = requireText(req.body, ['name'], 'El nombre es requerido');
    return useCases.createGenre({ name, price: req.body.price });
  }, 201));
  router.put('/:id', auth, admin, handle((req) => {
    const { name, price } = req.body ?? {};
    return useCases.updateGenre({ id: req.params.id, name, price });
  }));
  router.delete('/:id', auth, admin, handle((req) => useCases.deleteGenre({ id: req.params.id })));

  return router;
};
