import { useState } from 'react';
import { login } from '../services/autenticacaoService';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function fazerLogin(event) {
    event.preventDefault();

    setErro('');

    try {
      const data = await login(email, senha);

      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <form onSubmit={fazerLogin}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
      />

      <button type="submit">Entrar</button>
      {erro && <p>{erro}</p>}
    </form>
  );
}

export default Login;
