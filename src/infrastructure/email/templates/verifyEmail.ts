import type { EmailTemplates } from '../../../application/ports';
import { escapeHtml } from '../escapeHtml';

export const verifyEmail = ({ url }: EmailTemplates['verifyEmail']) => ({
  subject: 'Verifica tu email',
  html: `
    <h2>Bienvenido</h2>
    <p>Haz clic en el enlace para verificar tu cuenta. Caduca en 24h.</p>
    <a href="${escapeHtml(url)}">Verificar email</a>
  `,
});
