const { client } = require("../../db/mongodb.js");
const { dbName, ordersCollection: collectionName } = require("./names.js");

module.exports = client?.db(dbName)?.collection(collectionName);
