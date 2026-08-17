import { useState } from 'react';
import { removerUsuario } from '../services/usuariosService';

function Perfil({ usuario, token, fazerLogout, aoEditar }) {
  const [erro, setErro] = useState('');

  async function excluirConta() {
    const confirmou = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    );

    if (!confirmou) {
      return;
    }

    setErro('');

    try {
      await removerUsuario(token, usuario.id);

      fazerLogout();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <span className="profile-label">PERFIL</span>
          <h2>Olá, {usuario.nome}</h2>
          <p>Gerencie as informações da sua conta.</p>
        </div>

        <div className="profile-info">
          <div className="profile-item">
            <span>Nome</span>
            <strong>{usuario.nome}</strong>
          </div>

          <div className="profile-item">
            <span>Idade</span>
            <strong>{usuario.idade} anos</strong>
          </div>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        <div className="profile-actions">
          <button type="button" className="button-secondary" onClick={aoEditar}>
            Editar perfil
          </button>

          <button
            type="button"
            className="button-danger"
            onClick={excluirConta}
          >
            Excluir conta
          </button>

          <button
            type="button"
            className="button-secondary"
            onClick={fazerLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
