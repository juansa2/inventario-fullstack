const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true },
  unidad: { type: String, required: true, trim: true }, // e.g., kg, litros, unidades
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);
