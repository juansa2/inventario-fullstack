// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const corsOptions = {
  origin: 'https://inventario-fullstack-ktvh8jhou.vercel.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Rutas ---
app.get('/', (req, res) => {
  res.send('El servidor está funcionando y conectado a la base de datos.');
});

// Todas tus rutas de API (/api/products) van aquí...
// POST
app.post('/api/products', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const newProduct = new Product({ name, quantity, price });
    await newProduct.save();
    res.status(201).json({ message: 'Producto guardado', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// GET
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// DELETE
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// PUT
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// --- Conexión a MongoDB y Arranque del Servidor ---
const MONGO_URI = "mongodb+srv://juansa2_db_user:Careloco1*@clusterinventarioweb.u2vlbrg.mongodb.net/inventarioDB?retryWrites=true&w=majority&appName=Clusterinventarioweb";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    // ** SOLO ARRANCAMOS EL SERVIDOR DESPUÉS DE UNA CONEXIÓN EXITOSA **
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });