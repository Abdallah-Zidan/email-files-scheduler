const fs = require("fs");
module.exports = async function listDirectoryFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir);
    return files.map((file) => `${dir}/${file}`);
  } catch (error) {
    return [];
  }
};
