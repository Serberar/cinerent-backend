import { badRequest } from '../../domain/errors';

// Exige que los campos sean textos no vacíos y devuelve solo esos campos
export function requireText<F extends string>(source: unknown, fields: readonly F[], message: string): Record<F, string> {
  const data = (source ?? {}) as Record<string, unknown>;
  const result = {} as Record<F, string>;
  for (const field of fields) {
    const value = data[field];
    if (typeof value !== 'string' || !value.trim()) throw badRequest(message);
    result[field] = value;
  }
  return result;
}

// Se queda con los campos que son textos; los demás se ignoran
export function optionalText<F extends string>(source: unknown, fields: readonly F[]): Partial<Record<F, string>> {
  const data = (source ?? {}) as Record<string, unknown>;
  const result: Partial<Record<F, string>> = {};
  for (const field of fields) {
    const value = data[field];
    if (typeof value === 'string') result[field] = value;
  }
  return result;
}
