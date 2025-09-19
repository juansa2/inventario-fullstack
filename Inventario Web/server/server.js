const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Computer = require('./models/computer');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'https://inventario-fullstack.vercel.app'
     // Puedes ajustar o quitar esta si tu URL cambió
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Ruta para REGISTRAR un nuevo usuario
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Revisar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    // 2. Crear el nuevo usuario (la contraseña se hashea automáticamente por el 'pre-save' hook)
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar.', error: error.message });
  }
});

// Ruta para INICIAR SESIÓN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por su email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Comparar la contraseña ingresada con la guardada en la BD
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Si todo es correcto, crear un token (pase de acceso)
    const payload = { userId: user._id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usamos nuestro secreto guardado en Render
      { expiresIn: '1h' } // El pase de acceso expira en 1 hora
    );

    res.json({ message: 'Inicio de sesión exitoso.', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.', error: error.message });
  }
});

app.get('/', (req, res) => res.send('Servidor de inventario funcionando.'));

app.post('/api/products', async (req, res) => {
  try {
    const newComputer = new Computer(req.body);
    await newComputer.save();
    res.status(201).json({ message: 'Equipo guardado', product: newComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el equipo', error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const computers = await Computer.find({});
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComputer = await Computer.findByIdAndDelete(id);
    if (!deletedComputer) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el equipo' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedComputer = await Computer.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedComputer) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json({ message: 'Equipo actualizado exitosamente', product: updatedComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el equipo' });
  }
});

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error CRÍTICO al conectar a MongoDB:', err);
  });