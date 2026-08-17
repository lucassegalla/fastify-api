async function autenticar(request) {
  await request.jwtVerify();
}

module.exports = autenticar;
