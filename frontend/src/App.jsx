import { useEffect, useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import { decodificarToken } from './utils/token';
import Perfil from './components/Perfil';
import { buscarUsuarioPorId } from './services/usuariosService';
import EditarPerfil from './components/EditarPerfil';
import AdminUsuarios from './components/AdminUsuarios';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  const [telaPublica, setTelaPublica] = useState('login');

  const dadosToken = token ? decodificarToken(token) : null;

  const [usuario, setUsuario] = useState(null);

  const [editandoPerfil, setEditandoPerfil] = useState(false);

  function fazerLogout() {
    localStorage.removeItem('token');
    setToken('');
    setUsuario(null);
  }

  useEffect(() => {
    async function buscarPerfil() {
      if (!token || !dadosToken?.id) {
        return;
      }

      try {
        const usuarioEncontrado = await buscarUsuarioPorId(
          token,
          dadosToken.id,
        );

        setUsuario(usuarioEncontrado);
      } catch (error) {
        if (error.status === 401) {
          fazerLogout();
        }
      }
    }

    buscarPerfil();
  }, [token]);

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
              <Cadastro setToken={setToken} />

              <button onClick={() => setTelaPublica('login')}>
                Já tenho uma conta
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {usuario ? (
            <>
              {editandoPerfil ? (
                <EditarPerfil
                  usuario={usuario}
                  token={token}
                  aoCancelar={() => setEditandoPerfil(false)}
                  aoAtualizar={(usuarioAtualizado) => {
                    setUsuario(usuarioAtualizado);
                    setEditandoPerfil(false);
                  }}
                />
              ) : (
                <Perfil
                  usuario={usuario}
                  fazerLogout={fazerLogout}
                  aoEditar={() => setEditandoPerfil(true)}
                />
              )}

              {dadosToken?.role === 'admin' && <AdminUsuarios token={token} />}
            </>
          ) : (
            <p>Carregando perfil...</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
