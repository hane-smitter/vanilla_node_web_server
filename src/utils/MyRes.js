// My Response Object with additional methods
class MyRes {
  res;
  statusCode;
  defaultStatusCode = 200;
  headerContentType = "text/plain";
  constructor(res) {
    this.res = res;
    this.statusCode = res.statusCode;
  }
  /**
   *
   * @param {Object} payload - The payload to send as response
   * @param {number} statusCode - The status code. Defults to `200`
   */
  json(payload, statusCode) {
    this.setHeader("application/json");
    this.send(payload, statusCode);
  }
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  }
  setHeader(type) {
    this.headerContentType = type;
    // this.res.setHeader(contentType, this.headerContentType);
  }
  send(payload = { op: "info", msg: "" }, statusCode) {
    if (statusCode && typeof statusCode === "number") {
      this.statusCode = statusCode;
    }
    payload = JSON.stringify(payload);
    this.res.statusCode = this.statusCode || defaultStatusCode;
    this.res.setHeader("Content-Type", this.headerContentType);
    this.res.end(payload);
  }
}

module.exports = MyRes;
