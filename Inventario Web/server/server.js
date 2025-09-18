// server/server.js (Versión actualizada)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Computer = require('./models/computer'); // <-- CAMBIO: Importamos el nuevo modelo

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const corsOptions = {
  // ... (tu configuración de CORS no cambia)
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Rutas ---
app.get('/', (req, res) => {
  res.send('El servidor está funcionando y conectado a la base de datos.');
});

// POST: Añadir un nuevo equipo
app.post('/api/products', async (req, res) => {
  try {
    const newComputer = new Computer(req.body); // <-- CAMBIO
    await newComputer.save();
    res.status(201).json({ message: 'Equipo guardado', product: newComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// GET: Obtener todos los equipos
app.get('/api/products', async (req, res) => {
  try {
    const computers = await Computer.find({}); // <-- CAMBIO
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// DELETE: Eliminar un equipo
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComputer = await Computer.findByIdAndDelete(id); // <-- CAMBIO
    if (!deletedComputer) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// PUT: Actualizar un equipo
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedComputer = await Computer.findByIdAndUpdate(id, updatedData, { new: true }); // <-- CAMBIO
    if (!updatedComputer) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json({ message: 'Equipo actualizado exitosamente', product: updatedComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// --- Conexión a MongoDB y Arranque del Servidor ---
// ... (tu conexión a MongoDB no cambia)
mongoose.connect(MONGO_URI)
  .then(() => {
    // ...
    app.listen(PORT, '0.0.0.0', () => {
      // ...
    });
  })
  .catch(err => {
    // ...
  });