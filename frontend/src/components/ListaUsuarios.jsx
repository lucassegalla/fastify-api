function ListaUsuarios({ usuarios, setUsuarioEmEdicao, aoRemover }) {
  return (
    <div>
      {usuarios.map((usuario) => (
        <div key={usuario.id}>
          <p>
            {usuario.nome} - {usuario.email} - {usuario.idade} anos
          </p>

          <button onClick={() => setUsuarioEmEdicao(usuario)}>Editar</button>

          <button onClick={() => aoRemover(usuario.id)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}

export default ListaUsuarios;
