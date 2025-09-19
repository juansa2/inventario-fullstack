// server/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Cada email debe ser único
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// "Middleware" de Mongoose: Esto se ejecuta ANTES de que un usuario se guarde.
// Usamos una función normal para tener acceso a 'this' (el documento del usuario).
userSchema.pre('save', async function(next) {
  // Si la contraseña no ha sido modificada, no hacemos nada.
  if (!this.isModified('password')) {
    return next();
  }

  // "Licuamos" la contraseña con un nivel de complejidad de 12 (salt).
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Añadimos un método al modelo para comparar las contraseñas en el login.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;