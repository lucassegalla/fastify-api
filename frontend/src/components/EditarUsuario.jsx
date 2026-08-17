import { useState } from 'react';
import { atualizarUsuario } from '../services/usuariosService';

function EditarUsuario({ usuario, token, aoAtualizar, aoCancelar }) {
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
    <div className="admin-edit-card">
      <div className="profile-header">
        <span className="profile-label">EDIÇÃO DE USUÁRIO</span>

        <h2>Editar {usuario.nome}</h2>

        <p>Atualize as informações deste usuário.</p>
      </div>

      <form onSubmit={salvarAlteracoes} className="auth-form">
        <div className="form-group">
          <label htmlFor="admin-nome">Nome</label>

          <input
            id="admin-nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-idade">Idade</label>

          <input
            id="admin-idade"
            type="number"
            value={idade}
            onChange={(event) => setIdade(event.target.value)}
            disabled={carregando}
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-email">E-mail</label>

          <input
            id="admin-email"
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
  );
}

export default EditarUsuario;
