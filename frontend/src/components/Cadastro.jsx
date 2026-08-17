import { useState } from 'react';
import { criarUsuario } from '../services/usuariosService';
import { login } from '../services/autenticacaoService';

function Cadastro({ setToken, irParaLogin }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(event) {
    event.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      await criarUsuario({
        nome,
        idade: Number(idade),
        email,
        senha,
      });

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
          <span className="auth-label">CADASTRO</span>

          <h2>Crie sua conta</h2>

          <p>Preencha seus dados para começar.</p>
        </div>

        <div className="demo-notice">
          <strong>Ambiente de demonstração</strong>

          <p>
            Use um e-mail fictício. Esta aplicação é apenas uma demonstração e
            não requer dados reais.
          </p>
        </div>

        <form onSubmit={cadastrar} className="auth-form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="idade">Idade</label>

            <input
              id="idade"
              type="number"
              placeholder="Sua idade"
              value={idade}
              onChange={(event) => setIdade(event.target.value)}
              min="0"
              max="150"
              required
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
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
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>

          {erro && <p className="form-error">{erro}</p>}
        </form>

        <div className="auth-footer">
          <span>Já possui uma conta?</span>

          <button
            type="button"
            className="button-link"
            onClick={irParaLogin}
            disabled={carregando}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
