// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtenemos el token del encabezado 'Authorization'
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. No se proveyó un token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token con nuestro secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Añadimos los datos del usuario (el payload del token) al objeto 'req'
    req.user = decoded; 
    next(); // Pasamos al siguiente paso (la ruta real)
  } catch (error) {
    res.status(403).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;