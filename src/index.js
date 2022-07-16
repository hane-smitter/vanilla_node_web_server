require("dotenv").config();
const http = require("http");
const querystring = require("node:querystring");
const chalk = require("chalk");

const { DB } = require("./db/mongodb.js");
const MyRes = require("./utils/MyRes.js");
const myEmitter = require("./emitter/EventEmitters.js");

// app.use(express.json());
// app.use(express.urlencoded({ limit: "30mb", extended: true }));

// app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 8001;

// Without Express __START

const server = http.createServer((req, res) => {
  const myRes = new MyRes(res);
  const requestMethod = String(req.method).toUpperCase();
  const url = new URL(`http://localhost:${process.env.PORT}${req.url}`);

  // console.log(url);
  // console.log(requestMethod);
  // if (url === "/delPhone" && requestMethod === "POST") {
  //   console.log("YES, ISSA NEW CUSTOMER");
  // }

  switch (url.pathname) {
    case "/newCustomer":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch1", requestMethod);
        if (requestMethod !== "POST") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        console.log("route hit");
        const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ data });
        console.log({ query });
        req.body = data;
        req.query = query;
        myEmitter.emit("insertCustomer", req, myRes);
      })();
      break;

    case "/getCustomer":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch2", requestMethod);
        if (requestMethod !== "GET") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        console.log("GET CUSTOMER ROUTE");
        // const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ query });
        req.query = query;
        myEmitter.emit("getCustomer", req, myRes);
      })();
      break;

    // update customer
    case "/modCustomer":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch3", requestMethod);
        const allowedMethods = ["PATCH", "PUT"];
        if (!allowedMethods.includes(requestMethod)) {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        console.log("Update CUSTOMER ROUTE");
        const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ query });
        req.body = data;
        req.query = query;
        myEmitter.emit("updateCustomer", req, myRes);
      })();
      break;

    // delete customer
    case "/delCustomer":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch4", requestMethod);
        if (requestMethod !== "DELETE") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        console.log("DELETE CUSTOMER ROUTE");
        const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ query });
        req.body = data;
        req.query = query;
        myEmitter.emit("deleteCustomer", req, myRes);
      })();
      break;

    // PHONE ROUTES
    case "/newPhone":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch5", requestMethod);
        if (requestMethod !== "POST") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ data });
        console.log({ query });
        req.body = data;
        req.query = query;
        myEmitter.emit("insertPhone", req, myRes);
      })();
      break;

    // find/retrieve phone route
    case "/getPhone":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch6", requestMethod);
        if (requestMethod !== "GET") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        console.log("GET PHONE ROUTE");
        // const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ query });
        req.query = query;
        myEmitter.emit("getPhone", req, myRes);
      })();
      break;

    // update phone
    case "/modPhone":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch7 MATCHED", requestMethod);
        const allowedMethods = ["PATCH", "PUT"];
        if (!allowedMethods.includes(requestMethod)) {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          myRes.send({ op: "err", msg: `CANNOT ${req.method}/` });
          return;
        }

        try {
          console.log("Update PHONE ROUTE");
          const data = await getReqBodyData(req);
          const query = getRequestQuery(req.url);

          console.log({ data });
          console.log({ query });
          req.body = data;
          req.query = query;
          myEmitter.emit("updatePhone", req, myRes);
        } catch (error) {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          myRes.send({ op: "error", msg: error.message });
          return;
        }
      })();
      break;

    // delete phone
    case "/delPhone":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch8", requestMethod);
        if (requestMethod !== "DELETE") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }

        try {
          console.log("DELETE PHONE ROUTE");
          const data = await getReqBodyData(req);
          const query = getRequestQuery(req.url);

          console.log("data at delphone route match", data);
          console.log({ query });
          req.body = data;
          req.query = query;
          myEmitter.emit("deletePhone", req, myRes);
        } catch (error) {
          console.log(error.message);
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: error.message });
        }
      })();
      break;

    // ORDER ROUTES
    case "/newOrder":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch5", requestMethod);
        if (requestMethod !== "POST") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ data });
        console.log({ query });
        req.body = data;
        req.query = query;
        myEmitter.emit("insertOrder", req, myRes);
      })();
      break;

    // find/retrieve order route
    case "/getOrder":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch6", requestMethod);
        if (requestMethod !== "GET") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }
        console.log("GET ORDER ROUTE");
        // const data = await getReqBodyData(req);
        const query = getRequestQuery(req.url);

        console.log({ query });
        req.query = query;
        myEmitter.emit("getOrder", req, myRes);
      })();
      break;

    // update order
    case "/modOrder":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch7 MATCHED", requestMethod);
        const allowedMethods = ["PATCH", "PUT"];
        if (!allowedMethods.includes(requestMethod)) {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          myRes.send({ op: "err", msg: `CANNOT ${req.method}/` });
          return;
        }

        try {
          console.log("Update ORDER ROUTE");
          const data = await getReqBodyData(req);
          const query = getRequestQuery(req.url);

          console.log({ data });
          console.log({ query });
          req.body = data;
          req.query = query;
          myEmitter.emit("updateOrder", req, myRes);
        } catch (error) {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          myRes.send({ op: "error", msg: error.message });
          return;
        }
      })();
      break;

    // delete order
    case "/delOrder":
      // wrapped in IIFE to scope variables
      (async () => {
        console.log("requestMethod in switch8", requestMethod);
        if (requestMethod !== "DELETE") {
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: `CANNOT ${req.method}/` });
        }

        try {
          console.log("DELETE ORDER ROUTE");
          const data = await getReqBodyData(req);
          const query = getRequestQuery(req.url);

          console.log("data at delorder route match", data);
          console.log({ query });
          req.body = data;
          req.query = query;
          myEmitter.emit("deleteOrder", req, myRes);
        } catch (error) {
          console.log(error.message);
          // set the status code of our response
          myRes.statusCode = 400;
          // send an error response when request method is not allowed
          return myRes.send({ op: "error", msg: error.message });
        }
      })();
      break;

    default:
      // console.log("default switch")
      break;
  }
});
DB.on("connected", function () {
  console.log(chalk.rgb(208, 60, 240)("DB is connected"));
  myEmitter.emit("ready", server, PORT);
}).on("error", function () {
  console.log(chalk.red("DB NOT CONNECTED!"));
});
// Without Express __END

/* UTILITY FUNCTIONS FOR NON-EXPRESS APP*/
/**
 *
 * @param {Object} req - Request object
 * @returns {Object}
 */
async function getReqBodyData(req) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }
  let results;
  try {
    results = Buffer.concat(buffers).toString();
    results = results && JSON.parse(results);
    // console.log({ results });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return results;
}

/**
 *
 * @param {string|Object} query - query string or Request object
 * @returns {Object}
 */
function getRequestQuery(query) {
  let url = query;
  // if is a req object
  if (typeof query === "object") {
    const strUrl = String(query.url);
    // const str = strUrl.split("?")[strUrl.length - 1];
    url = strUrl;
  }
  const splitUrl = url.split("?");
  query = splitUrl[splitUrl.length - 1];
  const results = querystring.decode(query);

  // This would be an object
  return results;
}
