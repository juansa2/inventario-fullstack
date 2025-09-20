const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Computer = require('./models/computer');
const User = require('./models/user');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const corsOptions = {
  origin: [
    'https://inventario-fullstack.vercel.app',
    'https://inventario-fullstack-juansa2.vercel.app' // Asegúrate de tener todas tus URLs de Vercel
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Rutas Públicas (Autenticación) ---
app.get('/', (req, res) => res.send('Servidor de inventario funcionando.'));

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso.', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.', error: error.message });
  }
});

// --- Middleware de Seguridad para Rutas de Inventario ---
// A partir de aquí, todas las rutas a /api/products requerirán un token válido.
app.use