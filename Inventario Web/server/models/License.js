const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  software: { type: String, required: true, trim: true },
  clave: { type: String, required: true, trim: true, unique: true },
  fechaExpiracion: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);
