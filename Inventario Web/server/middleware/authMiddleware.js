// Importa la librería 'jsonwebtoken' para verificar los tokens.
const jwt = require('jsonwebtoken');

// Define y exporta la función del middleware.
module.exports = function(req, res, next) {
  // Obtiene el token de la cabecera 'Authorization' de la petición.
  const token = req.header('Authorization');

  // Si no se proporciona ningún token, devuelve un error 401 (No autorizado).
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  // El token usualmente viene en formato "Bearer <token>", así que lo extraemos.
  const tokenValue = token.split(' ')[1];

  // Si después de separar no hay un valor de token, es un formato inválido.
  if (!tokenValue) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  try {
    // Verifica el token usando el secreto guardado en las variables de entorno.
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    // Si el token es válido, 'decoded' contendrá el payload (ej. { user: { userId: '...' } }).
    // Añadimos el payload del usuario a la petición ('req') para que las siguientes rutas puedan usarlo.
    req.user = decoded.user;
    // Llama a 'next()' para pasar el control a la siguiente función de middleware o a la ruta final.
    next();
  } catch (ex) {
    // Si el token no es válido (ha expirado, ha sido manipulado, etc.), devuelve un error 400.
    res.status(400).json({ message: 'Token inválido.' });
  }
};