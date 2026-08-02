const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida') {
    super(message, 400, 'Bad Request');
  }
}

module.exports = BadRequestError;
