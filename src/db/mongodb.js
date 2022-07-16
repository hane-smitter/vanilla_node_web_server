const { MongoClient } = require("mongodb");
const EventEmitter = require("node:events");

class DbEmitter extends EventEmitter {}
const dbEmitter = new DbEmitter();

// dbEmitter.on("dbready", () => {});
let client;

async function main() {
  const uri = process.env.MONGODB || require("../../creds.json").mongodbUri;

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    return;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

main()
  .then(() => {
    dbEmitter.emit("connected");
  })
  .catch((error) => {
    dbEmitter.emit("error", error.message);
    console.error(error);
  });

module.exports = {
  DB: dbEmitter,
  client,
};
