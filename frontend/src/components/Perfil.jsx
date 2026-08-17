function Perfil({ usuario, fazerLogout, aoEditar }) {
  return (
    <div>
      <h2>Meu perfil</h2>

      <p>Nome: {usuario.nome}</p>
      <p>Idade: {usuario.idade}</p>

      <button onClick={aoEditar}>Editar perfil</button>

      <button onClick={fazerLogout}>Sair</button>
    </div>
  );
}

export default Perfil;
