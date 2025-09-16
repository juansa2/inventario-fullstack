const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'https://inventario-fullstack.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// --- RUTA DE PRUEBA SIMPLIFICADA ---
app.get('/api/products', (req, res) => {
  console.log('Ruta /api/products de prueba alcanzada con éxito.');
  res.json([
    { _id: '1', name: 'Producto de Prueba A', quantity: 10, price: 100 },
    { _id: '2', name: 'Producto de Prueba B', quantity: 20, price: 200 }
  ]);
});

// --- RUTA BASE ---
app.get('/', (req, res) => {
  res.send('Servidor de prueba mínimo funcionando.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de prueba corriendo en el puerto ${PORT}`);
});