const { join } = require("path");
const { readFileSync } = require("fs");
const envFile = readFileSync(join(__dirname, ".env"), "utf8");
const env = require("dotenv").parse(envFile);

module.exports = {
  emailUser: env.email_user,
  emailPassword: env.email_password,
  emailHost: env.email_host,
  emailPort: Number(env.email_port),
  emailSecure: [true, "true"].includes(env.email_secure),
  emailFrom: env.email_from,
  emailTo: env.email_to,
  emailFilesDir: env.email_files_dir,
  maxAttempts: Number(env.max_attempts),
  failedEmailsTracker: env.failed_emails_tracker,
  jobInterval: Number(env.job_interval),
};
