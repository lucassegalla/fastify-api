const API_URL = import.meta.env.VITE_API_URL;

async function login(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || data.message || 'Erro ao realizar login.');
  }

  return data;
}

export { login };
