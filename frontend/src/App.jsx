import { useEffect, useState } from 'react';
import Login from './components/Login';
import ListaUsuarios from './components/ListaUsuarios';
import Cadastro from './components/Cadastro';
import EditarUsuario from './components/EditarUsuario';
import { listarUsuarios, removerUsuario } from './services/usuariosService';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });
  const [usuarios, setUsuarios] = useState([]);
  const [telaPublica, setTelaPublica] = useState('login');
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [paginacao, setPaginacao] = useState(null);

  function fazerLogout() {
    localStorage.removeItem('token');
    setToken('');
    setUsuarios([]);
    setUsuarioEmEdicao(null);
  }

  async function excluirUsuario(id) {
    try {
      await removerUsuario(token, id);

      if (usuarioEmEdicao?.id === id) {
        setUsuarioEmEdicao(null);
      }

      if (usuarios.length === 1 && paginaAtual > 1) {
        setPaginaAtual((pagina) => pagina - 1);
        return;
      }

      const data = await listarUsuarios(token, paginaAtual, 10);

      setUsuarios(data.dados);
      setPaginacao(data.paginacao);
    } catch (error) {
      if (error.status === 401) {
        fazerLogout();
        return;
      }

      alert(error.message);
    }
  }

  useEffect(() => {
    async function buscarUsuarios() {
      if (!token) {
        return;
      }

      try {
        const data = await listarUsuarios(token, paginaAtual, 2);

        setUsuarios(data.dados);
        setPaginacao(data.paginacao);

        setUsuarios(data.dados);
      } catch (error) {
        if (error.status === 401) {
          fazerLogout();
        }
      }
    }

    buscarUsuarios();
  }, [token, paginaAtual]);

  return (
    <div>
      <h1>Fastify API Basics</h1>

      {!token ? (
        <>
          {telaPublica === 'login' ? (
            <>
              <Login setToken={setToken} />

              <button onClick={() => setTelaPublica('cadastro')}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              <Cadastro />

              <button onClick={() => setTelaPublica('login')}>
                Já tenho uma conta
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={fazerLogout}>Sair</button>

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

          <ListaUsuarios
            usuarios={usuarios}
            setUsuarioEmEdicao={setUsuarioEmEdicao}
            aoRemover={excluirUsuario}
          />

          {paginacao && (
            <div>
              <button
                onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>

              <span>
                Página {paginacao.paginaAtual} de {paginacao.totalPaginas}
              </span>

              <button
                onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                disabled={paginaAtual === paginacao.totalPaginas}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
