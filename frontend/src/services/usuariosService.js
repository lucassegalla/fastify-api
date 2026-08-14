const API_URL = import.meta.env.VITE_API_URL;

async function criarUsuario(usuario) {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.mensagem || data.message || 'Erro ao criar usuário.',
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

async function buscarUsuarioPorId(token, id) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.mensagem || data.message || 'Erro ao buscar usuário.',
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

export { criarUsuario, buscarUsuarioPorId };
