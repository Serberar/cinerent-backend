require('dotenv').config();

if ((process.env.JWT_ACCESS_SECRET ?? '').length < 32) throw new Error('JWT_ACCESS_SECRET necesita al menos 32 caracteres');

module.exports = {
  port: Number(process.env.PORT) || 4000,
  // Número de proxies de confianza delante de la API (0 si no hay ninguno)
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_ACCESS_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },
};
