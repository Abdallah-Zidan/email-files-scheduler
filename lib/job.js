const { extractEmailData, getFiles } = require("./mail-files");
const getTracker = require("./tracker");
const getEmailSender = require("./mail-sender");
const removeSent = require("./remove-sent");

async function manipulateAttachments(attachments, attachmentGetter) {
  if (attachments && attachments.length > 0) {
    const out = [];
    for (const file of attachments) {
      const fileId = file.fileId;
      if (fileId) {
        try {
          const attachment = await attachmentGetter(fileId);
          if (attachment) {
            out.push(attachment);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return out.length > 0 ? out : null;
  }
  return null;
}

/**
 * @param {import("../types").IConfig} config
 * @param {import("../types").AttachmentGetter} attachmentGetter
 */
async function run(config, attachmentGetter) {
  const files = await getFiles(config.emailFilesDir);
  if (files.length === 0) return;

  const { sendEmail, close } = getEmailSender(config);

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
  };

  console.log("email job started");
  for (const file of files) {
    if (tracker.shouldAttempt(file)) {
      const email = await extractEmailData(file);
      if (email) {
        email.attachments = await manipulateAttachments(
          email.attachments,
          attachmentGetter
        );

        try {
          const info = await sendEmail(email);
          console.log(
            "Email sent",
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
  if (config.removeSent) await removeSent(sentFiles);
  else sentFiles.forEach(tracker.send);
  console.log("email job finished");
  await tracker.save();
  close();
}
module.exports = run;
