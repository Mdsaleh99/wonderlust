class ExpressError extends Error {
  constructor(statusCode, message) {
    super(); // here super() calling Error class constructor
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
