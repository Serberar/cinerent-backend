const nodemailer = require('nodemailer');

module.exports = ({ smtp }) => {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });

  return {
    send: async (to, templateName, data) => {
      const { subject, html } = require(`./templates/${templateName}`)(data);
      await transporter.sendMail({ from: smtp.from, to, subject, html });
    },
  };
};
