const { join } = require("path");
const { readFileSync } = require("fs");
const envFile = readFileSync(join(__dirname, ".env"), "utf8");
const env = require("dotenv").parse(envFile);
const emailConfig = require("./email.config.json");

module.exports = {
  emailUser: env.email_user || process.env.email_user,
  emailPassword: env.email_password || process.env.email_password,
  emailHost: env.email_host || process.env.email_host,
  emailPort: emailConfig.port,
  emailSecure: emailConfig.secure,
  emailFrom: emailConfig.from,
  emailTo: emailConfig.to,
  emailFilesDir: emailConfig.filesDir,
  maxAttempts: emailConfig.maxAttempts,
  failedEmailsTracker: emailConfig.failedEmailsTracker,
  jobInterval: emailConfig.jobInterval,
  removeSent:emailConfig.removeSent,
  attachments: emailConfig.attachments,
  getToAddresses(subject) {
    if (subject.includes("New sales")) return emailConfig.to.newSales;
    else if (subject.includes("Support")) return emailConfig.to.support;
    else if (subject.includes("Complaint")) return emailConfig.to.complaint;
    return emailConfig.to.default;
  },
};
