import { useEffect, useState } from 'react';
import { listarUsuarios } from '../services/usuariosService';

function AdminUsuarios({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const data = await listarUsuarios(token);

        setUsuarios(data.dados);
      } catch (error) {
        setErro(error.message);
      }
    }

    buscarUsuarios();
  }, [token]);

  return (
    <div>
      <h2>Usuários cadastrados</h2>

      {erro && <p>{erro}</p>}

      {usuarios.map((usuario) => (
        <div key={usuario.id}>
          <p>
            {usuario.nome} - {usuario.idade} anos
          </p>
        </div>
      ))}
    </div>
  );
}

export default AdminUsuarios;
