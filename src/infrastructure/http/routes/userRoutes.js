const { Router } = require('express');
const handle = require('../handler');
const requireText = require('../validate');

const REGISTER_FIELDS = ['firstName', 'lastName', 'dni', 'phone', 'address', 'cardNumber', 'email', 'password'];

module.exports = ({ useCases, auth }) => {
  const router = Router();

  router.post('/register', handle((req) => (
    useCases.register(requireText(req.body, REGISTER_FIELDS, 'Todos los campos son requeridos'))
  ), 201));
  router.post('/login', handle((req) => (
    useCases.login(requireText(req.body, ['email', 'password'], 'Email y contrasena requeridos'))
  )));
  router.get('/verify-email', handle((req) => (
    useCases.verifyEmail(requireText(req.query, ['token'], 'Token requerido'))
  )));
  router.get('/me', auth, handle((req) => useCases.getProfile({ userId: req.user.id })));
  router.patch('/me', auth, handle((req) => {
    const { firstName, lastName, phone, address } = req.body ?? {};
    return useCases.updateUser({ userId: req.user.id, firstName, lastName, phone, address });
  }));
  router.patch('/me/card', auth, handle((req) => (
    useCases.updateCard({ userId: req.user.id, ...requireText(req.body, ['cardNumber'], 'El número de tarjeta es requerido') })
  )));
  router.patch('/me/password', auth, handle((req) => (
    useCases.changePassword({
      userId: req.user.id,
      ...requireText(req.body, ['currentPassword', 'newPassword'], 'La contraseña actual y la nueva son requeridas'),
    })
  )));

  return router;
};
