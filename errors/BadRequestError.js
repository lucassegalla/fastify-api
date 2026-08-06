const AppError = require('./AppError');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.error = 'Bad Request';
  }
}

module.exports = BadRequestError;
