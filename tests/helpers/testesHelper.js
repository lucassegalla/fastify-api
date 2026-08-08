async function autenticarUsuario(app, email, senha) {
  const login = await app.inject({
    method: 'POST',
    url: '/login',
    payload: {
      email,
      senha,
    },
  });

  const { token } = JSON.parse(login.body);

  return token;
}

async function criarUsuario(app, dados) {

}

module.exports = {
  autenticarUsuario,
  criarUsuario,
};
