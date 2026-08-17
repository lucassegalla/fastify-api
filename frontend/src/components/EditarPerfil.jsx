import { useState } from 'react';
import { atualizarUsuario } from '../services/usuariosService';

function EditarPerfil({ usuario, token, aoAtualizar, aoCancelar }) {
  const [nome, setNome] = useState(usuario.nome);
  const [idade, setIdade] = useState(usuario.idade);
  const [email, setEmail] = useState(usuario.email);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function salvarAlteracoes(event) {
    event.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      const usuarioAtualizado = await atualizarUsuario(token, usuario.id, {
        nome,
        idade: Number(idade),
        email,
      });

      aoAtualizar(usuarioAtualizado);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <span className="profile-label">EDIÇÃO</span>
          <h2>Editar perfil</h2>
          <p>Atualize as informações da sua conta.</p>
        </div>

        <form onSubmit={salvarAlteracoes} className="auth-form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              className="button-primary"
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <button
              type="button"
              className="button-secondary"
              onClick={aoCancelar}
              disabled={carregando}
            >
              Cancelar
            </button>
          </div>

          {erro && <p className="form-error">{erro}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;
