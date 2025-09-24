require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const connectDB = require('./config/db');
const User = require('./models/user');
const Computer = require('./models/computer');
const authMiddleware = require('./middleware/authMiddleware');

// --- Inicialización y Configuración ---
const app = express(); // ¡Esta es la línea clave que faltaba al principio!
connectDB();

// --- Middlewares Globales ---

// --- Configuración de CORS ---
// Creamos una "lista blanca" de los orígenes que permitiremos.
const whitelist = [
  'https://inventario-fullstack.vercel.app', // Tu frontend en Vercel
  'http://localhost:5173'                     // Tu frontend en desarrollo local (puerto por defecto de Vite)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitimos peticiones sin 'origin' (como las de Postman o apps móviles)
    if (!origin) return callback(null, true);
    
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true); // El origen está en la lista blanca, lo permitimos.
    } else {
      callback(new Error('Not allowed by CORS')); // El origen no está permitido.
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json()); // Para poder recibir JSON en el body de las peticiones

// --- Servir archivos estáticos (imágenes, documentos, etc.) ---
// Cualquier archivo en la carpeta 'public' será accesible desde la raíz. Ej: /images/mi-imagen.jpg
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas de Autenticación (Públicas) ---
// POST: Registrar un nuevo usuario
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    user = new User({ name, email, password });
    await user.save();
    const payload = { user: { userId: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// POST: Iniciar sesión
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    const payload = { user: { userId: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});


// --- Middleware de Seguridad para Rutas de Inventario ---
// A partir de aquí, todas las rutas a /products requerirán un token válido.
app.use('/products', authMiddleware);

// --- Rutas Protegidas (Inventario) ---

// POST: Añadir un nuevo equipo (asigna el dueño automáticamente)
app.post('/products', async (req, res) => {
  try {
    const newComputer = new Computer({
      ...req.body,
      user: req.user.userId
    });
    await newComputer.save();
    res.status(201).json({ message: 'Equipo guardado', product: newComputer });
  } catch (error) {
    // --- INICIO DE LA MEJORA ---
    console.error('Error al guardar:', error); // Log detallado en el servidor

    // Si es un error de duplicado (código 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Error: El número de serie ya existe en el inventario.' });
    }

    // Si es un error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: `Error de validación: ${messages.join(', ')}` });
    }

    // Para cualquier otro error
    res.status(500).json({ message: 'Error interno al guardar el equipo.' });
    // --- FIN DE LA MEJORA ---
  }
});

// GET: Obtener solo los equipos del usuario logueado
app.get('/products', async (req, res) => {
  try {
    const computers = await Computer.find({ user: req.user.userId });
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos' });
  }
});

// DELETE: Eliminar un equipo (solo si le pertenece al usuario)
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedComputer = await Computer.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el equipo' });
  }
});

// PUT: Actualizar un equipo (solo si le pertenece al usuario)
app.put('/products/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedComputer = await Computer.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, updatedData, { new: true });
    if (!updatedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    res.json({ message: 'Equipo actualizado exitosamente', product: updatedComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el equipo' });
  }
});

// --- RUTA PARA CAMBIO DE CONTRASEÑA ---
app.put('/api/auth/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    // 1. Buscar al usuario en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Verificar que la contraseña actual es correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
    }

    // 3. Validar la nueva contraseña (opcional, pero recomendado)
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    // 4. Hashear y guardar la nueva contraseña
    user.password = newPassword; // El hash se hace automáticamente gracias al .pre('save') en el modelo User
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- RUTA PARA OBTENER DATOS DEL USUARIO LOGUEADO ---
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    // req.user.userId es añadido por el authMiddleware
    const user = await User.findById(req.user.userId).select('-password'); // .select('-password') excluye la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- Servir Frontend en Producción ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  });
}

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));