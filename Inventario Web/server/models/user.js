// Importa la librería 'mongoose' para definir el esquema y el modelo.
const mongoose = require('mongoose');
// Importa 'bcryptjs' para el hasheo de contraseñas.
const bcrypt = require('bcryptjs');

// Define el esquema (la estructura) para los documentos de usuario en la colección.
const userSchema = new mongoose.Schema({
  // Define el campo 'name'.
  name: {
    type: String,      // El tipo de dato es una cadena de texto.
    required: true,    // Este campo es obligatorio.
    trim: true         // Elimina espacios en blanco al principio y al final.
  },
  // Define el campo 'email'.
  email: {
    type: String,      // El tipo de dato es una cadena de texto.
    required: true,    // Este campo es obligatorio.
    unique: true,      // Asegura que no haya dos usuarios con el mismo email.
    lowercase: true,   // Convierte el email a minúsculas antes de guardarlo.
    trim: true         // Elimina espacios en blanco al principio y al final.
  },
  // Define el campo 'password'.
  password: {
    type: String,      // El tipo de dato es una cadena de texto.
    required: true     // Este campo es obligatorio.
  }
});

// Define un "middleware" de Mongoose que se ejecuta antes del evento 'save'.
// Se usa una función normal (no de flecha) para tener acceso al contexto 'this', que es el documento del usuario.
userSchema.pre('save', async function(next) {
  // Comprueba si el campo 'password' ha sido modificado. Si no, salta el hasheo.
  if (!this.isModified('password')) {
    return next();
  }

  // Genera un 'salt' (una cadena aleatoria) para añadir seguridad al hasheo. El '12' es el costo o rondas.
  const salt = await bcrypt.genSalt(12);
  // Hashea la contraseña del usuario ('this.password') con el salt generado y la reemplaza.
  this.password = await bcrypt.hash(this.password, salt);
  // Llama a 'next()' para continuar con el proceso de guardado.
  next();
});

// Añade un método personalizado 'comparePassword' al esquema del usuario.
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Utiliza bcrypt para comparar la contraseña proporcionada ('candidatePassword') con la contraseña hasheada del usuario ('this.password').
  return bcrypt.compare(candidatePassword, this.password);
};

// Crea el modelo 'User' a partir del 'userSchema'. 'User' será el nombre de la colección en MongoDB (en plural: 'users').
const User = mongoose.model('User', userSchema);

// Exporta el modelo para que pueda ser utilizado en otras partes de la aplicación (como en server.js).
module.exports = User;