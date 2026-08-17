function decodificarToken(token) {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    const padding = '='.repeat((4 - (base64.length % 4)) % 4);

    const payloadDecodificado = atob(base64 + padding);

    return JSON.parse(payloadDecodificado);
  } catch {
    return null;
  }
}

export { decodificarToken };
