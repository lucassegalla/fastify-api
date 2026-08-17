const ForbiddenError = require('../errors/ForbiddenError');

async function autorizarAdmin(request) {
  if (request.user.role !== 'admin') {
    throw new ForbiddenError('Acesso permitido apenas para administradores.');
  }
}

module.exports = autorizarAdmin;
