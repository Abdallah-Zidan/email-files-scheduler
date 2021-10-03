const { promises, existsSync } = require("fs");

const dummyTracker = {
  shouldAttempt() {
    return true;
  },

  incrementAttempts() {},

  async save() {},
  send() {},
};

module.exports = async function getTracker(trackingFile, maxAttempts) {
  try {
    if (!existsSync(trackingFile))
      await promises.writeFile(trackingFile, JSON.stringify({}));
    const trackingData = await promises.readFile(trackingFile, "utf8");
    const trackingObject = trackingData.length ? JSON.parse(trackingData) : {};

    function shouldAttempt(filename) {
      return (
        ((trackingObject.attempts &&
          trackingObject.attempts[filename] <= maxAttempts) ||
          !trackingObject.attempts) &&
        !trackingObject.sent?.[filename]
      );
    }

    function incrementAttempts(filename) {
      if (trackingObject.attempts) trackingObject.attempts[filename]++;
      else
        trackingObject.attempts = {
          [filename]: 1,
        };
    }

    function send(filename) {
      if (trackingObject.sent) trackingObject.sent[filename] = true;
      else trackingObject.sent = { [filename]: true };
    }

    async function save() {
      try {
        await promises.writeFile(trackingFile, JSON.stringify(trackingObject));
      } catch (error) {
        console.log(error);
      }
    }

    return {
      shouldAttempt,
      incrementAttempts,
      send,
      save,
    };
  } catch (error) {
    console.log(error);
    return dummyTracker;
  }
};
