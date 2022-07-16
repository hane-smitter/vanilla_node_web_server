const { client } = require("../../db/mongodb.js");
const { dbName, phoneCollection: collectionName } = require("./names.js");

module.exports = client?.db(dbName)?.collection(collectionName);
