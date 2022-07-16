const { client } = require("../../db/mongodb.js");
const { dbName, customersCollection: collectionName } = require("./names.js");

// console.log({ client });

module.exports = client?.db(dbName)?.collection(collectionName);
