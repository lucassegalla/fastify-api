async function autenticar(request, reply) {
  await request.jwtVerify();
}

module.exports = autenticar;
