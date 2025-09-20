const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // La variable MONGO_URI debe estar configurada en las variables de entorno de Render
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Conectado...');
  } catch (err) {
    console.error(err.message);
    // Salir del proceso si no se puede conectar a la base de datos
    process.exit(1);
  }
};

module.exports = connectDB;