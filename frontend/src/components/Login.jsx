import { useState } from 'react';
import { login } from '../services/autenticacaoService';

function Login({ setToken, irParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event) {
    event.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      const data = await login(email, senha);

      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-label">ACESSO</span>
          <h2>Bem-vindo</h2>
          <p>Entre com sua conta para continuar.</p>
        </div>

        <form onSubmit={fazerLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            className="button-primary"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          {erro && <p className="form-error">{erro}</p>}
        </form>

        <div className="auth-footer">
          <span>Não possui uma conta?</span>

          <button
            type="button"
            className="button-link"
            onClick={irParaCadastro}
            disabled={carregando}
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
