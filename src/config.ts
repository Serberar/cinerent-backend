import 'dotenv/config';

const { env } = process;

function sameSite(): 'lax' | 'strict' | 'none' {
  const value = env.COOKIE_SAMESITE ?? 'lax';
  if (value !== 'lax' && value !== 'strict' && value !== 'none') throw new Error('COOKIE_SAMESITE debe ser lax, strict o none');
  return value;
}

function jwtSecret(): string {
  const secret = env.JWT_ACCESS_SECRET ?? '';
  if (secret.length < 32) throw new Error('JWT_ACCESS_SECRET necesita al menos 32 caracteres');
  return secret;
}

export const config = {
  port: Number(env.PORT) || 4000,
  // Número de proxies de confianza delante de la API (0 si no hay ninguno)
  trustProxy: Number(env.TRUST_PROXY) || 0,
  frontendUrl: env.FRONTEND_URL || 'http://localhost:3000',
  // Con la web y la API en dominios distintos hace falta COOKIE_SAMESITE=none y COOKIE_SECURE=true (HTTPS)
  cookie: { secure: env.COOKIE_SECURE === 'true', sameSite: sameSite() },
  jwtSecret: jwtSecret(),
  jwtExpiresIn: env.JWT_EXPIRES_IN || '12h',
  smtp: {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM,
  },
};

export type Config = typeof config;
