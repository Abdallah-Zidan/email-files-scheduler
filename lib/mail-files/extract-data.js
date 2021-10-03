const fs = require("fs");

module.exports = async function extractEmailData(filePath) {
  const data = await fs.promises.readFile(filePath, "utf8");
  if (data.length === 0) {
    return null;
  }
  try {
    const object = JSON.parse(data);
    return {
      content: object.content,
      subject: object.subject,
      attachments: object.attachments,
      values: object.values,
      properties: object.properties,
      cc: object.cc,
    };
  } catch (error) {
    return null;
  }
};
