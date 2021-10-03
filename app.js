"use strict";
const config = require("./config");
const {runJob}= require("./lib");

console.log("mail scheduler application start");
console.log("configuration:", {
  ...config,
  emailPassword: "*********",
});

function appStart() {
  let shouldRun = true;
  setInterval(async () => {
    if (shouldRun) {
   
      shouldRun = false;
      try {
        await runJob(config);
      } catch (error) {
        console.log(error);
      }
    
      shouldRun = true;
    }
  }, config.jobInterval);
}
appStart();
