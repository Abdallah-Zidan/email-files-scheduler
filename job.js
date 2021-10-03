const {
  extractEmailData,
  getFiles,
  getEmailSender,
  getTracker,
} = require("./lib");
const removeSent = require("./lib/remove-sent");

/** @param {import("./types").IConfig} config */
async function run(config) {
  const sendMail = getEmailSender(config);
  const files = await getFiles(config.emailFilesDir);

  if (files.length === 0) return;

  const sentFiles = [];
  const failedFiles = [];

  const tracker = await getTracker(
    config.failedEmailsTracker,
    config.maxAttempts
  );

  const onFailed = (file) => {
    failedFiles.push(file);
    tracker.incrementAttempts(file);
  };

  const onSuccess = (file) => {
    sentFiles.push(file);
    tracker.send(file);
  };

  console.log("email job started");
  for (const file of files) {
    if (tracker.shouldAttempt(file)) {
      const email = await extractEmailData(file);
      if (email) {
        console.log("attachments", email.attachments);
        try {
          const info = await sendMail(email);
          console.log(
            "Message sent",
            JSON.stringify({
              messageId: info.messageId,
              accepted: info.accepted,
            })
          );
          if (info.messageId) {
            onSuccess(file);
          } else onFailed(file);
        } catch (error) {
          if (error.code === "EAUTH") {
            console.log(error);
            onFailed(file);
            break;
          }
        }
      }
    }
  }
  if (config.removeSent) {
    await removeSent(sentFiles);
  }

  console.log("email job finished");
  await tracker.save();
}
module.exports = run;
