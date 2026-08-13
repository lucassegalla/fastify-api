import { useState } from 'react';
import { criarUsuario } from '../services/usuariosService';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function cadastrar(event) {
    event.preventDefault();

    setErro('');
    setSucesso('');

    try {
      await criarUsuario({
        nome,
        idade: Number(idade),
        email,
        senha,
      });

      setSucesso('Usuário cadastrado com sucesso.');

      setNome('');
      setIdade('');
      setEmail('');
      setSenha('');
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <form onSubmit={cadastrar}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />

      <input
        type="number"
        placeholder="Idade"
        value={idade}
        onChange={(event) => setIdade(event.target.value)}
      />

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
      />

      <button type="submit">Cadastrar</button>

      {erro && <p>{erro}</p>}
      {sucesso && <p>{sucesso}</p>}
    </form>
  );
}

export default Cadastro;
