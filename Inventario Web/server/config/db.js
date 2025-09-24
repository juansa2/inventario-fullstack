// Importa la librería 'mongoose' para interactuar con la base de datos MongoDB.
const mongoose = require('mongoose');

// Define una función asíncrona para establecer la conexión con la base de datos.
const connectDB = async () => {
  try {
    // Intenta conectar a MongoDB usando la cadena de conexión (URI) almacenada en las variables de entorno.
    // Esta URI es sensible y se gestiona a través del archivo .env o la configuración del servicio de hosting (Render).
    await mongoose.connect(process.env.MONGO_URI);
    // Si la conexión es exitosa, muestra un mensaje en la consola.
    console.log('MongoDB Conectado...');
  } catch (err) {
    // Si ocurre un error durante la conexión, muestra el mensaje de error en la consola.
    console.error(err.message);
    // Termina la ejecución del proceso de Node.js con un código de error (1) para indicar que algo falló críticamente.
    process.exit(1);
  }
};

// Exporta la función 'connectDB' para que pueda ser utilizada en otros archivos (como en server.js).
module.exports = connectDB;