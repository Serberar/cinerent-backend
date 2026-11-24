import { Router } from 'express';
import { handle } from '../handler';
import { currentUser, type RouteDeps } from '../types';
import { optionalText, requireText } from '../validate';

const REGISTER_FIELDS = ['firstName', 'lastName', 'dni', 'phone', 'address', 'cardNumber', 'email', 'password'] as const;
const PROFILE = ['firstName', 'lastName', 'phone', 'address'] as const;

export function userRoutes({ useCases, session, auth }: RouteDeps) {
  const router = Router();

  router.post('/register', handle(async (req) => (
    useCases.register(requireText(req.body, REGISTER_FIELDS, 'Todos los campos son requeridos'))
  ), 201));
  router.post('/login', handle(async (req, res) => {
    const { token, user } = await useCases.login(requireText(req.body, ['email', 'password'], 'Email y contrasena requeridos'));
    session.open(res, token);
    return { user };
  }));
  router.post('/logout', handle(async (_req, res) => {
    session.close(res);
    return { ok: true };
  }));
  router.get('/verify-email', handle(async (req) => useCases.verifyEmail(requireText(req.query, ['token'], 'Token requerido'))));
  router.get('/me', auth, handle((req) => useCases.getProfile({ userId: currentUser(req).id })));
  router.patch('/me', auth, handle((req) => useCases.updateUser({ ...optionalText(req.body, PROFILE), userId: currentUser(req).id })));
  router.patch('/me/card', auth, handle(async (req) => (
    useCases.updateCard({ userId: currentUser(req).id, ...requireText(req.body, ['cardNumber'], 'El número de tarjeta es requerido') })
  )));
  router.patch('/me/password', auth, handle(async (req) => useCases.changePassword({
    userId: currentUser(req).id,
    ...requireText(req.body, ['currentPassword', 'newPassword'], 'La contraseña actual y la nueva son requeridas'),
  })));

  return router;
}
