import jwt, { type SignOptions } from 'jsonwebtoken';
import type { TokenService } from '../../application/ports';

export function createTokenService({ secret, expiresIn }: { secret: string; expiresIn: string }): TokenService {
  return {
    sign: (userId) => jwt.sign({ sub: userId }, secret, { expiresIn: expiresIn as SignOptions['expiresIn'], algorithm: 'HS256' }),
    verify: (token) => {
      const { sub } = jwt.verify(token, secret, { algorithms: ['HS256'] });
      if (typeof sub !== 'string') throw new Error('token sin usuario');
      return sub;
    },
  };
}
