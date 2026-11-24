import type { Request, RequestHandler } from 'express';
import type { UseCases } from '../../application';
import type { Role } from '../../domain/User';
import { unauthorized } from '../../domain/errors';
import type { Session } from './session';

export interface RouteDeps {
  useCases: UseCases;
  session: Session;
  auth: RequestHandler;
  admin: RequestHandler;
}

export interface CurrentUser {
  id: string;
  role: Role;
}

const users = new WeakMap<Request, CurrentUser>();

export const setUser = (req: Request, user: CurrentUser) => { users.set(req, user); };

export function currentUser(req: Request): CurrentUser {
  const user = users.get(req);
  if (!user) throw unauthorized('Sesión requerida');
  return user;
}

export const param = (req: Request, name: string) => String(req.params[name]);
