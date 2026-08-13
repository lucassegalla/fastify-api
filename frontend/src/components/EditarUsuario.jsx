import { useState } from 'react';
import { atualizarUsuario } from '../services/usuariosService';

function EditarUsuario({ usuario, token, aoAtualizar, aoCancelar }) {
  const [nome, setNome] = useState(usuario.nome);
  const [idade, setIdade] = useState(usuario.idade);
  const [email, setEmail] = useState(usuario.email);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function salvarAlteracoes(event) {
    event.preventDefault();

    setErro('');
    setSucesso('');

    try {
      const usuarioAtualizado = await atualizarUsuario(token, usuario.id, {
        nome,
        idade: Number(idade),
        email,
      });

      setSucesso('Usuário atualizado com sucesso.');

      aoAtualizar(usuarioAtualizado);
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <form onSubmit={salvarAlteracoes}>
      <h2>Editar usuário</h2>

      <input
        type="text"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />

      <input
        type="number"
        value={idade}
        onChange={(event) => setIdade(event.target.value)}
      />

      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <button type="submit">Salvar</button>

      <button type="button" onClick={aoCancelar}>
        Cancelar
      </button>

      {erro && <p>{erro}</p>}
      {sucesso && <p>{sucesso}</p>}
    </form>
  );
}

export default EditarUsuario;
