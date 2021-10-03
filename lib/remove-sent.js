const { promises } = require("fs");

module.exports = async function removeSent(files) {
  for (const file of files) {
    try {
      await promises.unlink(file);
    } catch (error) {
      console.log(error);
    }
  }
};
