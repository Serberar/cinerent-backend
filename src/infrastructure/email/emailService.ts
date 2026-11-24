import nodemailer from 'nodemailer';
import type { EmailSender, EmailTemplates } from '../../application/ports';
import type { Config } from '../../config';
import { rentConfirmation } from './templates/rentConfirmation';
import { returnConfirmation } from './templates/returnConfirmation';
import { verifyEmail } from './templates/verifyEmail';

type Templates = { [T in keyof EmailTemplates]: (data: EmailTemplates[T]) => { subject: string; html: string } };

const templates: Templates = { verifyEmail, rentConfirmation, returnConfirmation };

export function createEmailSender({ smtp }: Pick<Config, 'smtp'>): EmailSender {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });

  return {
    send: async (to, template, data) => {
      const { subject, html } = templates[template](data);
      await transporter.sendMail({ from: smtp.from, to, subject, html });
    },
  };
}
