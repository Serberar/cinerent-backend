const { Router } = require('express');
const handle = require('../handler');

module.exports = ({ useCases, auth, admin }) => {
  const router = Router();
  router.use(auth, admin);

  router.get('/all-movies', handle(() => useCases.listAllMovies()));
  router.get('/alquileres', handle(() => useCases.listActive()));
  router.get('/lista-de-usuarios', handle(() => useCases.listUsers()));
  router.get('/:id', handle((req) => useCases.getUserDetail({ userId: req.params.id })));
  router.put('/:id', handle((req) => {
    const { firstName, lastName, phone, address } = req.body ?? {};
    return useCases.updateUserAdmin({ userId: req.params.id, firstName, lastName, phone, address });
  }));
  router.patch('/:id/suspend', handle((req) => useCases.suspendUser({ userId: req.params.id, note: req.body?.note })));
  router.patch('/:id/password', handle((req) => useCases.resetUserPassword({ userId: req.params.id, newPassword: req.body?.newPassword })));

  return router;
};
