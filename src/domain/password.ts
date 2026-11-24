import { badRequest } from './errors';

const MIN_LENGTH = 8;

// bcrypt ignora lo que pasa de 72 bytes: se rechaza en vez de recortarlo en silencio
export function assertPassword(password: unknown): asserts password is string {
  if (typeof password !== 'string' || password.length < MIN_LENGTH) {
    throw badRequest(`La contraseña debe tener al menos ${MIN_LENGTH} caracteres`);
  }
  if (Buffer.byteLength(password) > 72) throw badRequest('La contraseña es demasiado larga');
}
