"use strict";
const config = require("./config");
const { runJob, filePathGetter } = require("./lib");

console.log("mail scheduler application start");
console.log("configuration:", {
  ...config,
  emailPassword: "*********",
});

async function appStart() {
  let shouldRun = true;
  try {
    const attachmentGetter = await filePathGetter(config.attachments);
    setInterval(async () => {
      if (shouldRun) {
        shouldRun = false;
        try {
          await runJob(config, attachmentGetter);
        } catch (error) {
          console.log(error);
        }

        shouldRun = true;
      }
    }, config.jobInterval);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
appStart().catch(console.error);
