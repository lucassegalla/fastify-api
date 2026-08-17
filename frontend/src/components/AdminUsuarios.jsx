import { useEffect, useState } from 'react';
import { listarUsuarios, removerUsuario } from '../services/usuariosService';
import EditarUsuario from './EditarUsuario';

function AdminUsuarios({ token, idUsuarioAtual }) {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [paginacao, setPaginacao] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuarios() {
      try {
        const data = await listarUsuarios(token, pagina, 10);

        if (!ativo) {
          return;
        }

        setUsuarios(data.dados);
        setPaginacao(data.paginacao);
        setErro('');
      } catch (error) {
        if (!ativo) {
          return;
        }

        setErro(error.message);
      }
    }

    carregarUsuarios();

    return () => {
      ativo = false;
    };
  }, [token, pagina]);

  async function recarregarPagina() {
    const data = await listarUsuarios(token, pagina, 10);

    setUsuarios(data.dados);
    setPaginacao(data.paginacao);
  }

  async function excluirUsuario(id) {
    const confirmou = window.confirm(
      'Tem certeza que deseja excluir este usuário?',
    );

    if (!confirmou) {
      return;
    }

    setErro('');

    try {
      await removerUsuario(token, id);

      const ultimaPaginaFicouVazia = usuarios.length === 1 && pagina > 1;

      if (ultimaPaginaFicouVazia) {
        setPagina((paginaAtual) => paginaAtual - 1);
        return;
      }

      await recarregarPagina();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-header">
        <div>
          <span className="admin-label">ADMINISTRAÇÃO</span>
          <h2>Usuários cadastrados</h2>
          <p>Visualize e gerencie as contas da aplicação.</p>
        </div>

        <span className="admin-count">
          {paginacao?.totalUsuarios ?? 0} usuários
        </span>
      </div>

      {erro && <p className="form-error">{erro}</p>}

      {usuarioEmEdicao && (
        <EditarUsuario
          key={usuarioEmEdicao.id}
          usuario={usuarioEmEdicao}
          token={token}
          aoCancelar={() => setUsuarioEmEdicao(null)}
          aoAtualizar={(usuarioAtualizado) => {
            setUsuarios((usuariosAtuais) =>
              usuariosAtuais.map((usuario) =>
                usuario.id === usuarioAtualizado.id
                  ? usuarioAtualizado
                  : usuario,
              ),
            );

            setUsuarioEmEdicao(null);
          }}
        />
      )}

      <div className="users-list">
        {usuarios.map((usuario) => (
          <div className="user-row" key={usuario.id}>
            <div className="user-info">
              <strong>{usuario.nome}</strong>
              <span>{usuario.idade} anos</span>
            </div>

            <div className="user-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={() => setUsuarioEmEdicao(usuario)}
              >
                Editar
              </button>

              <button
                type="button"
                className="button-danger"
                disabled={usuario.id === idUsuarioAtual}
                onClick={() => excluirUsuario(usuario.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {paginacao && paginacao.totalPaginas > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="button-secondary"
            disabled={pagina === 1}
            onClick={() => setPagina((paginaAtual) => paginaAtual - 1)}
          >
            Anterior
          </button>

          <span>
            Página {paginacao.paginaAtual} de {paginacao.totalPaginas}
          </span>

          <button
            type="button"
            className="button-secondary"
            disabled={pagina === paginacao.totalPaginas}
            onClick={() => setPagina((paginaAtual) => paginaAtual + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}

export default AdminUsuarios;
