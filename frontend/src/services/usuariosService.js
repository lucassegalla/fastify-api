const API_URL = import.meta.env.VITE_API_URL;

async function listarUsuarios(token, page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/usuarios?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.mensagem || data.message || 'Erro ao buscar usuários.',
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

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
    throw new Error(data.mensagem || data.message || 'Erro ao criar usuário.');
  }

  return data;
}

async function atualizarUsuario(token, id, usuario) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuario),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.mensagem || data.message || 'Erro ao atualizar usuário.',
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

async function removerUsuario(token, id) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();

    const error = new Error(
      data.mensagem || data.message || 'Erro ao remover usuário.',
    );

    error.status = response.status;

    throw error;
  }
}

export { listarUsuarios, criarUsuario, atualizarUsuario, removerUsuario };
