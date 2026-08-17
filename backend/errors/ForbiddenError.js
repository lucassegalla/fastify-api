const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403, 'Forbidden');
  }
}

module.exports = ForbiddenError;
