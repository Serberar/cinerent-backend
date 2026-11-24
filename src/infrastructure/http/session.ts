// La sesión va en una cookie que JavaScript no puede leer: un XSS no puede llevársela.
import type { CookieOptions, Request, Response } from 'express';

const NAME = 'cinerent_session';

export interface SessionOptions {
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
}

export function createSession({ secure, sameSite }: SessionOptions) {
  const options: CookieOptions = { httpOnly: true, secure, sameSite, path: '/api' };
  return {
    open: (res: Response, token: string) => { res.cookie(NAME, token, options); },
    close: (res: Response) => { res.clearCookie(NAME, options); },
    read: (req: Request): string | null => {
      for (const part of (req.headers.cookie ?? '').split(';')) {
        const [name, ...value] = part.trim().split('=');
        if (name === NAME) return decodeURIComponent(value.join('='));
      }
      return null;
    },
  };
}

export type Session = ReturnType<typeof createSession>;
