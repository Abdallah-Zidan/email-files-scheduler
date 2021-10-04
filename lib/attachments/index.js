const { basename } = require("path");
const fs = require("fs");
const { MongoClient,ObjectId } = require("mongodb");

function getClient(url) {
  return MongoClient.connect(url, { useNewUrlParser: true });
}

async function filePathGetter({ connURL, dbName, collName }) {
  const client = await getClient(connURL);
  const db = client.db(dbName);
  const coll = db.collection(collName);
  return async function (fileId) {
    const file = await coll.findOne({ _id: ObjectId(fileId) });
    if (file && fs.existsSync(file.path)) {
      return { path: file.path, filename: basename(file.path) };
    }
    return null;
  };
}

module.exports = filePathGetter;
