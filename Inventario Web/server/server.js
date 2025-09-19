// server/server.js (Versión Final y Completa)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Computer = require('./models/computer');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const corsOptions = {
  origin: [
    'https://inventario-fullstack.vercel.app',
    'https://inventario-fullstack-ktvh8jhou.vercel.app' // Asegúrate de que esta URL sea la tuya si ha cambiado
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Rutas ---
app.get('/', (req, res) => {
  res.send('El servidor está funcionando y conectado a la base de datos.');
});

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

// --- Conexión a MongoDB y Arranque del Servidor ---
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