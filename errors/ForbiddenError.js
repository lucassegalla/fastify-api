const AppError = require('./AppError');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.error = 'Forbidden';
  }
}

module.exports = ForbiddenError;
