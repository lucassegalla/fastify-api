const AppError = require('./AppError');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.error = 'Unauthorized';
  }
}

module.exports = UnauthorizedError;
