async function autenticarUsuario(app, email, senha) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/login',
    payload: {
      email,
      senha,
    },
  });

  const { token } = JSON.parse(login.body);

  return token;
}

async function criarUsuario(app, dados) {
  const resposta = await app.inject({
    method: 'POST',
    url: '/api/usuarios',
    payload: dados,
  });

  const usuario = JSON.parse(resposta.body);

  return usuario;
}

module.exports = {
  autenticarUsuario,
  criarUsuario,
};
