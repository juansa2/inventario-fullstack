// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importamos mongoose
const Product = require('./models/product'); // Importamos nuestro modelo

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const corsOptions = {
  origin: 'https://inventario-fullstack.vercel.app', // La URL de tu frontend en Vercel
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Conexión a MongoDB ---
const MONGO_URI = "mongodb+srv://juansa2_db_user:Careloco1*@clusterinventarioweb.u2vlbrg.mongodb.net/inventarioDB?retryWrites=true&w=majority&appName=Clusterinventarioweb"; // <-- PEGA TU CADENA DE CONEXIÓN AQUÍ

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- Rutas ---
app.get('/', (req, res) => {
  res.send('El servidor está funcionando y conectado a la base de datos.');
});

// Ruta para AÑADIR un producto (AHORA GUARDA EN LA DB)
app.post('/api/products', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const newProduct = new Product({ name, quantity, price }); // Creamos el producto con el modelo
    await newProduct.save(); // Lo guardamos en la base de datos
    
    console.log('Producto guardado en la base de datos:', newProduct);
    res.status(201).json({ message: 'Producto guardado', product: newProduct });
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para OBTENER todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}); // Busca todos los documentos en la colección Product
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para ELIMINAR un producto por su ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para ACTUALIZAR un producto por su ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // Los nuevos datos vienen en el cuerpo de la petición

    // Buscamos el producto y lo actualizamos
    // { new: true } hace que nos devuelva el documento ya actualizado
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ponemos el servidor a escuchar
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});