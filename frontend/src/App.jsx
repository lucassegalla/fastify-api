import { useEffect, useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import { decodificarToken } from './utils/token';
import Perfil from './components/Perfil';
import { buscarUsuarioPorId } from './services/usuariosService';
import EditarPerfil from './components/EditarPerfil';
import AdminUsuarios from './components/AdminUsuarios';
import './App.css';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  const [telaPublica, setTelaPublica] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);
  const [erroPerfil, setErroPerfil] = useState('');

  const dadosToken = token ? decodificarToken(token) : null;

  function fazerLogout() {
    localStorage.removeItem('token');

    setToken('');
    setUsuario(null);
    setEditandoPerfil(false);
    setCarregandoPerfil(false);
    setErroPerfil('');
  }

  useEffect(() => {
    async function buscarPerfil() {
      if (!token) {
        return;
      }

      if (!dadosToken?.id) {
        fazerLogout();
        return;
      }

      setCarregandoPerfil(true);
      setErroPerfil('');

      try {
        const usuarioEncontrado = await buscarUsuarioPorId(
          token,
          dadosToken.id,
        );

        setUsuario(usuarioEncontrado);
      } catch (error) {
        if (error.status === 401) {
          fazerLogout();
          return;
        }

        if (error.status === 404) {
          fazerLogout();
          return;
        }

        setErroPerfil(error.message || 'Não foi possível carregar o perfil.');
      } finally {
        setCarregandoPerfil(false);
      }
    }

    buscarPerfil();
  }, [token, dadosToken?.id]);

  return (
    <main className="app-main">
      {!token ? (
        telaPublica === 'login' ? (
          <Login
            setToken={setToken}
            irParaCadastro={() => setTelaPublica('cadastro')}
          />
        ) : (
          <Cadastro
            setToken={setToken}
            irParaLogin={() => setTelaPublica('login')}
          />
        )
      ) : carregandoPerfil ? (
        <p>Carregando perfil...</p>
      ) : erroPerfil ? (
        <p className="form-error">{erroPerfil}</p>
      ) : usuario ? (
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
              token={token}
              fazerLogout={fazerLogout}
              aoEditar={() => setEditandoPerfil(true)}
            />
          )}

          {dadosToken?.role === 'admin' && (
            <AdminUsuarios token={token} idUsuarioAtual={dadosToken.id} />
          )}
        </>
      ) : null}
    </main>
  );
}

export default App;
