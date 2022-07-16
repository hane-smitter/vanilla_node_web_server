const EventEmitter = require("node:events");

// /* -------Mongoose controllers START---------- */
// const {
//   insertCustomer,
//   findCustomer,
//   updateCustomer,
//   deleteCustomer,
// } = require("../controllers/customerController");
// const {
//   insertPhone,
//   findPhone,
//   updatePhone,
//   deletePhone,
// } = require("../controllers/phoneController.js");
// const {
//   insertOrder,
//   findOrder,
//   updateOrder,
//   deleteOrder,
// } = require("../controllers/orderController.js");
// /* -------Mongoose controllers END---------- */

/* -------Mongodb controllers START---------- */
const {
  insertCustomer,
  findCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/mongodbControllers/customerController.js");
const {
  insertPhone,
  findPhone,
  updatePhone,
  deletePhone,
} = require("../controllers/mongodbControllers/phoneController.js");
const {
  insertOrder,
  findOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/mongodbControllers/orderController.js");
/* -------Mongodb controllers END---------- */

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//REGISTER EMITTERS

// when app is ready listen to PORT
myEmitter.on("ready", (server, port) => {
  server.listen(port, () => {
    console.log(`server listening on port: ${port}`);
  });
});

/* Customer Emitters */
// create new customer
// CREATE
myEmitter.on("insertCustomer", insertCustomer); // CREATE
// find/retrieve customer
myEmitter.on("getCustomer", findCustomer); // READ
// update customer
myEmitter.on("updateCustomer", updateCustomer); // UPDATE
// delete customer
myEmitter.on("deleteCustomer", deleteCustomer); // DELETE

/* Phone Emitters */
// create new customer
myEmitter.on("insertPhone", insertPhone); // CREATE
// find/retrieve customer
myEmitter.on("getPhone", findPhone); // READ
// update customer
myEmitter.on("updatePhone", updatePhone); // UPDATE
// delete customer
myEmitter.on("deletePhone", deletePhone); // DELETE

/* Order Emitter */
myEmitter.on("insertOrder", insertOrder);
myEmitter.on("getOrder", findOrder);
myEmitter.on("updateOrder", updateOrder);
myEmitter.on("deleteOrder", deleteOrder);

module.exports = myEmitter;
