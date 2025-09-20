require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = 'path';

const connectDB = require('./config/db');
const User = require('./models/user');
const Computer = require('./models/computer');
const authMiddleware = require('./middleware/authMiddleware');

// --- Inicialización y Configuración ---
const app = express(); // ¡Esta es la línea clave que faltaba al principio!
connectDB();

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json()); // Para poder recibir JSON en el body de las peticiones

// --- Rutas de Autenticación (Públicas) ---
// POST: Registrar un nuevo usuario
app.post('/api/auth/register', async (req, res) => {
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
    res.status(500).send('Error en el servidor');
  }
});

// POST: Iniciar sesión
app.post('/api/auth/login', async (req, res) => {
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
    res.status(500).send('Error en el servidor');
  }
});


// --- Middleware de Seguridad para Rutas de Inventario ---
// A partir de aquí, todas las rutas a /api/products requerirán un token válido.
app.use('/api/products', authMiddleware);

// --- Rutas Protegidas (Inventario) ---

// POST: Añadir un nuevo equipo (asigna el dueño automáticamente)
app.post('/api/products', async (req, res) => {
  try {
    const newComputer = new Computer({
      ...req.body,
      user: req.user.userId
    });
    await newComputer.save();
    res.status(201).json({ message: 'Equipo guardado', product: newComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el equipo', error: error.message });
  }
});

// GET: Obtener solo los equipos del usuario logueado
app.get('/api/products', async (req, res) => {
  try {
    const computers = await Computer.find({ user: req.user.userId });
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos' });
  }
});

// DELETE: Eliminar un equipo (solo si le pertenece al usuario)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedComputer = await Computer.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el equipo' });
  }
});

// PUT: Actualizar un equipo (solo si le pertenece al usuario)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedComputer = await Computer.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, updatedData, { new: true });
    if (!updatedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    res.json({ message: 'Equipo actualizado exitosamente', product: updatedComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el equipo' });
  }
});

// --- Servir Frontend en Producción ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));