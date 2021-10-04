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

  function close() {
    transporter.close();
  }

 
  return {
     /** @param {import("../../types").IEmail} email */
    async sendEmail({ subject, content, cc,attachments }) {
      const to = config.getToAddresses(subject);
      return await transporter.sendMail({
        from: config.emailFrom,
        to,
        subject,
        text: content,
        cc,
        attachments,       
      });
    },
    close,
  };
};
