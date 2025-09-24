// Importa el paquete 'dotenv' para cargar variables de entorno desde un archivo .env.
require('dotenv').config();
// Importa el framework 'express' para crear y gestionar el servidor web.
const express = require('express');
// Importa el middleware 'cors' para habilitar el Intercambio de Recursos de Origen Cruzado (CORS).
const cors = require('cors');
// Importa 'bcryptjs' para hashear y comparar contraseñas de forma segura.
const bcrypt = require('bcryptjs');
// Importa 'jsonwebtoken' para crear y verificar tokens de autenticación (JWT).
const jwt = require('jsonwebtoken');
// Importa el módulo 'path' de Node.js para trabajar con rutas de archivos y directorios.
const path = require('path');

// Importa la función de conexión a la base de datos desde './config/db.js'.
const connectDB = require('./config/db');
// Importa el modelo de Mongoose para los usuarios desde './models/user.js'.
const User = require('./models/user');
// Importa el modelo de Mongoose para los equipos/computadoras desde './models/computer.js'.
const Computer = require('./models/computer');
// Importa el middleware de autenticación personalizado desde './middleware/authMiddleware.js'.
const authMiddleware = require('./middleware/authMiddleware');
// --- NUEVOS MODELOS ---
// Importa los nuevos modelos de inventario.
const Meal = require('./models/Meal');
const Ingredient = require('./models/Ingredient');
const License = require('./models/License');


// --- Inicialización y Configuración ---
// Crea una instancia de la aplicación Express.
const app = express();
// Ejecuta la función para conectar a la base de datos MongoDB.
connectDB();

// --- Middlewares Globales ---

// --- Configuración de CORS ---
// Define una "lista blanca" de orígenes (URLs) que tienen permitido hacer peticiones a esta API.
const whitelist = [
  'https://inventario-fullstack.vercel.app', // URL del frontend en producción (Vercel).
  'http://localhost:5173'                     // URL del frontend en desarrollo local.
];

// Define las opciones para el middleware CORS.
const corsOptions = {
  // La función 'origin' determina si una petición de un origen específico debe ser permitida.
  origin: function (origin, callback) {
    // Permite peticiones que no tienen un 'origin' (ej. desde Postman o scripts de servidor).
    if (!origin) return callback(null, true);
    
    // Comprueba si el origen de la petición está en nuestra lista blanca.
    if (whitelist.indexOf(origin) !== -1) {
      // Si está en la lista, permite la petición.
      callback(null, true);
    } else {
      // Si no está, la rechaza con un error de CORS.
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Aplica el middleware CORS con las opciones definidas a todas las rutas de la aplicación.
app.use(cors(corsOptions));
// Aplica el middleware de Express para parsear cuerpos de petición en formato JSON.
app.use(express.json());

// --- Servir archivos estáticos (imágenes, documentos, etc.) ---
// Configura Express para servir archivos estáticos desde la carpeta 'public'.
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas de Autenticación (Públicas) ---
// Define la ruta para registrar un nuevo usuario (método POST).
app.post('/api/auth/register', async (req, res) => {
  // Extrae el nombre, email y contraseña del cuerpo de la petición.
  const { name, email, password } = req.body;
  try {
    // Busca si ya existe un usuario con el mismo email en la base de datos.
    let user = await User.findOne({ email });
    // Si el usuario ya existe, devuelve un error 400 (Bad Request).
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    // Crea una nueva instancia del modelo 'User' con los datos proporcionados.
    user = new User({ name, email, password });
    // Guarda el nuevo usuario en la base de datos. El 'pre-save' en el modelo se encargará de hashear la contraseña.
    await user.save();
    // Crea el payload para el JWT, que contiene el ID del usuario.
    const payload = { user: { userId: user.id } };
    // Firma el token JWT con el payload, un secreto y una fecha de expiración
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      // Si hay un error al firmar el token, lo lanza
      if (err) throw err;
      // Si todo es correcto, devuelve un estado 201 (Created) y el token
      res.status(201).json({ token });
    });
  } catch (error) {
    // Si ocurre cualquier otro error, lo muestra en la consola del servidor.
    console.error(error.message);
    // Devuelve un error 500 (Internal Server Error).
    res.status(500).send('Error en el servidor');
  }
});

// Define la ruta para iniciar sesión (método POST).
app.post('/api/auth/login', async (req, res) => {
  // Extrae el email y la contraseña del cuerpo de la petición.
  const { email, password } = req.body;
  try {
    // Busca al usuario por su email en la base de datos.
    const user = await User.findOne({ email });
    // Si el usuario no existe, devuelve un error 400 con un mensaje genérico.
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    // Compara la contraseña proporcionada con la contraseña hasheada en la base de datos.
    const isMatch = await bcrypt.compare(password, user.password);
    // Si las contraseñas no coinciden, devuelve un error 400.
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    // Crea el payload para el JWT.
    const payload = { user: { userId: user.id } };
    // Firma y devuelve el token JWT.
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});


// --- Middleware de Seguridad para Rutas de Inventario ---
// Aplica el 'authMiddleware' a todas las rutas que comiencen con '/api/products'.
app.use('/api/products', authMiddleware);
// Aplica el middleware a las nuevas rutas de inventario.
app.use('/api/meals', authMiddleware);
app.use('/api/ingredients', authMiddleware);
app.use('/api/licenses', authMiddleware);


// --- Rutas Protegidas (Inventario) ---

// Define la ruta para añadir un nuevo equipo (método POST).
app.post('/api/products', async (req, res) => {
  try {
    // Crea una nueva instancia del modelo 'Computer' con los datos del cuerpo y el ID del usuario logueado.
    const newComputer = new Computer({
      ...req.body,
      user: req.user.userId // El 'userId' es añadido a 'req' por el 'authMiddleware'.
    });
    // Guarda el nuevo equipo en la base de datos.
    await newComputer.save();
    // Devuelve un estado 201 y un mensaje de éxito junto con el producto creado.
    res.status(201).json({ message: 'Equipo guardado', product: newComputer });
  } catch (error) {
    // Muestra el error detallado en la consola del servidor.
    console.error('Error al guardar:', error);

    // Si el error es por una clave duplicada (ej. serial repetido).
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Error: El número de serie ya existe en el inventario.' });
    }

    // Si el error es de validación de Mongoose (ej. un campo requerido falta).
    if (error.name === 'ValidationError') {
      // Extrae los mensajes de error de validación y los une en una cadena.
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: `Error de validación: ${messages.join(', ')}` });
    }

    // Para cualquier otro tipo de error, devuelve una respuesta genérica.
    res.status(500).json({ message: 'Error interno al guardar el equipo.' });
  }
});

// Define la ruta para obtener todos los equipos del usuario logueado (método GET).
app.get('/api/products', async (req, res) => {
  try {
    // Busca en la base de datos todos los equipos cuyo campo 'user' coincida con el ID del usuario logueado.
    const computers = await Computer.find({ user: req.user.userId });
    // Devuelve la lista de equipos en formato JSON.
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos' });
  }
});

// Define la ruta para eliminar un equipo por su ID (método DELETE).
app.delete('/api/products/:id', async (req, res) => {
  try {
    // Busca y elimina un equipo que coincida con el ID de la URL y el ID del usuario logueado.
    const deletedComputer = await Computer.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    // Si no se encuentra el equipo (o no pertenece al usuario), devuelve un error 404 (Not Found).
    if (!deletedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    // Si se elimina correctamente, devuelve un mensaje de éxito.
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el equipo' });
  }
});

// Define la ruta para actualizar un equipo por su ID (método PUT).
app.put('/api/products/:id', async (req, res) => {
  try {
    // Obtiene los nuevos datos del cuerpo de la petición.
    const updatedData = req.body;
    // Busca un equipo por ID y usuario, y lo actualiza con los nuevos datos.
    const updatedComputer = await Computer.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, updatedData, { new: true });
    // Si no se encuentra el equipo, devuelve un error 404.
    if (!updatedComputer) return res.status(404).json({ message: 'Equipo no encontrado o no autorizado' });
    // Devuelve un mensaje de éxito y el producto actualizado.
    res.json({ message: 'Equipo actualizado exitosamente', product: updatedComputer });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el equipo' });
  }
});

// --- NUEVAS RUTAS DE INVENTARIO ---

// --- Rutas para Comidas (Meals) ---
app.get('/api/meals', async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.userId });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las comidas' });
  }
});

app.post('/api/meals', async (req, res) => {
  try {
    const newMeal = new Meal({ ...req.body, user: req.user.userId });
    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la comida' });
  }
});

app.put('/api/meals/:id', async (req, res) => {
  try {
    const updatedMeal = await Meal.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, req.body, { new: true });
    if (!updatedMeal) return res.status(404).json({ message: 'Comida no encontrada' });
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la comida' });
  }
});

app.delete('/api/meals/:id', async (req, res) => {
  try {
    const deletedMeal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedMeal) return res.status(404).json({ message: 'Comida no encontrada' });
    res.json({ message: 'Comida eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la comida' });
  }
});

// --- Rutas para Ingredientes (Ingredients) ---
app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ user: req.user.userId });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ingredientes' });
  }
});

app.post('/api/ingredients', async (req, res) => {
  try {
    const newIngredient = new Ingredient({ ...req.body, user: req.user.userId });
    await newIngredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el ingrediente' });
  }
});

app.put('/api/ingredients/:id', async (req, res) => {
  try {
    const updatedIngredient = await Ingredient.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, req.body, { new: true });
    if (!updatedIngredient) return res.status(404).json({ message: 'Ingrediente no encontrado' });
    res.json(updatedIngredient);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el ingrediente' });
  }
});

app.delete('/api/ingredients/:id', async (req, res) => {
  try {
    const deletedIngredient = await Ingredient.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedIngredient) return res.status(404).json({ message: 'Ingrediente no encontrado' });
    res.json({ message: 'Ingrediente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el ingrediente' });
  }
});

// --- Rutas para Licencias (Licenses) ---
app.get('/api/licenses', async (req, res) => {
  try {
    const licenses = await License.find({ user: req.user.userId });
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las licencias' });
  }
});

app.post('/api/licenses', async (req, res) => {
  try {
    const newLicense = new License({ ...req.body, user: req.user.userId });
    await newLicense.save();
    res.status(201).json(newLicense);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la licencia' });
  }
});

// --- RUTA PARA CAMBIO DE CONTRASEÑA ---
// Define la ruta para cambiar la contraseña del usuario (método PUT), protegida por autenticación.
app.put('/api/auth/change-password', authMiddleware, async (req, res) => {
  // Extrae las contraseñas del cuerpo de la petición.
  const { currentPassword, newPassword } = req.body;
  // Obtiene el ID del usuario desde el middleware.
  const userId = req.user.userId;

  try {
    // Busca al usuario en la base de datos por su ID.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Compara la contraseña actual proporcionada con la de la base de datos.
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
    }

    // Valida que la nueva contraseña cumpla con los requisitos mínimos.
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    // Asigna la nueva contraseña al objeto de usuario.
    user.password = newPassword;
    // Guarda los cambios. El 'pre-save' del modelo se encargará de hashear la nueva contraseña.
    await user.save();

    // Devuelve un mensaje de éxito.
    res.json({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- RUTA PARA OBTENER DATOS DEL USUARIO LOGUEADO ---
// Define la ruta para obtener los datos del usuario actualmente autenticado (método GET).
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    // Busca al usuario por el ID que el 'authMiddleware' añadió a la petición.
    // '.select('-password')' excluye el campo de la contraseña de la respuesta por seguridad.
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Devuelve los datos del usuario.
    res.json(user);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- Servir el Frontend en un entorno de producción ---
// Comprueba si la variable de entorno NODE_ENV está establecida en 'production'.
if (process.env.NODE_ENV === 'production') {
  // Sirve los archivos estáticos de la compilación del frontend (que están en la carpeta 'dist').
  app.use(express.static(path.join(__dirname, '../dist')));
  // Para cualquier otra petición GET que no coincida con las rutas de la API, sirve el 'index.html' del frontend.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  });
}

// --- Iniciar Servidor ---
// Define el puerto en el que escuchará el servidor, usando la variable de entorno PORT o 5000 por defecto.
const PORT = process.env.PORT || 5000;
// Inicia el servidor y muestra un mensaje en la consola.
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));