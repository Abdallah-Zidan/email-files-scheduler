const nodemailer = require("nodemailer");

/** @param {import("../../types").IConfig} config */
module.exports = function getEmailSender(config) {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: config.emailSecure,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });

  /** @param {import("../../types").IEmail} email */
  return async function sendEmail({ subject, content, cc }) {
    const to = config.getToAddresses(subject);
    console.log(to);
    return await transporter.sendMail({
      from: config.emailFrom,
      to,
      subject,
      text: content,
      cc,
    });
  };
};
