function decodificarToken(token) {
  try {
    const payload = token.split('.')[1];

    const payloadDecodificado = atob(payload);

    return JSON.parse(payloadDecodificado);
  } catch {
    return null;
  }
}

export { decodificarToken };
