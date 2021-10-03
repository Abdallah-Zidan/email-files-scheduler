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

  //   const failedTracker = await getTracker(
  //     config.failedEmailsTracker,
  //     config.maxAttempts
  //   );

  const onFailed = (file) => {
    failedFiles.push(file);
    //failedTracker.incrementAttempts(file);
  };

  console.log("email job started");
  for (const file of files) {
    // if (failedTracker.shouldAttempt(file)) {
    const email = await extractEmailData(file);
    if (email) {
      console.log(email.attachments);
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
          sentFiles.push(file);
        } else onFailed(file);
      } catch (error) {
        if (error.code === "EAUTH") {
          console.log(error);
          break;
        }
        onFailed(file);
      }
    }
  }
  // }

  await removeSent(sentFiles);
  console.log("email job finished");
  // await failedTracker.save();
}
module.exports = run;
