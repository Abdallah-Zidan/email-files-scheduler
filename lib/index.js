module.exports = {
  getEmailSender: require("./mail-sender"),
  removeSent: require("./remove-sent"),
  getTracker: require("./tracker"),
  ...require("./mail-files"),
};
