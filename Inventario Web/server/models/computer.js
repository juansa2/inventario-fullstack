// Importa la librería 'mongoose' para definir el esquema y el modelo.
const mongoose = require('mongoose');

// Define el esquema (la estructura) para los documentos de la colección de computadoras.
const computerSchema = new mongoose.Schema({
  // Define el campo 'tipo' del equipo.
  tipo: {
    type: String, // El tipo de dato es una cadena de texto.
    required: true, // Este campo es obligatorio.
    enum: ['Laptop', 'Desktop', 'Servidor', 'Otro'] // Solo permite estos valores.
  },
  // Define el campo 'marca'.
  marca: {
    type: String,
    required: true, // Es obligatorio.
    trim: true // Elimina espacios en blanco al principio y al final.
  },
  // Define el campo 'modelo'.
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  // Define el campo 'serial'.
  serial: {
    type: String,
    required: true,
    unique: true, // Asegura que no haya dos equipos con el mismo número de serie.
    trim: true
  },
  // Define el campo 'usuarioAsignado'.
  usuarioAsignado: {
    type: String,
    trim: true,
    default: '' // Si no se proporciona, su valor será una cadena vacía.
  },
  // Define una referencia al usuario que creó el registro.
  user: {
    type: mongoose.Schema.Types.ObjectId, // El tipo es un ID de objeto de MongoDB.
    ref: 'User', // Establece una relación con el modelo 'User'.
    required: true
  }
}, {
  // Añade automáticamente los campos 'createdAt' y 'updatedAt' a cada documento.
  timestamps: true
});

// Crea y exporta el modelo 'Computer' a partir del esquema definido.
module.exports = mongoose.model('Computer', computerSchema);