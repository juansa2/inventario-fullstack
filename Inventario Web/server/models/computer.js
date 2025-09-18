// server/models/computer.js

const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema({
  tipo: { type: String, required: true, enum: ['Laptop', 'Desktop', 'Servidor', 'Otro'] },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  serial: { type: String, required: true, unique: true },
  usuarioAsignado: { type: String, default: 'Sin asignar' },
  fechaAdquisicion: { type: Date, default: Date.now }
});

const Computer = mongoose.model('Computer', computerSchema);

module.exports = Computer;