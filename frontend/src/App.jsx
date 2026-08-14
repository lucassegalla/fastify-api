import { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  const [telaPublica, setTelaPublica] = useState('login');

  function fazerLogout() {
    localStorage.removeItem('token');
    setToken('');
  }

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
          <p>Usuário autenticado.</p>

          <button onClick={fazerLogout}>Sair</button>
        </>
      )}
    </div>
  );
}

export default App;
