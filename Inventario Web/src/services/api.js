// Define la URL base de la API, tomándola de las variables de entorno de Vite o usando un valor por defecto para desarrollo.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Define una función para obtener las cabeceras de autenticación.
const getAuthHeaders = () => {
  // Obtiene el token del almacenamiento local del navegador.
  const token = localStorage.getItem('token');
  // Devuelve un objeto de cabeceras.
  return {
    // Establece el tipo de contenido de las peticiones a JSON.
    'Content-Type': 'application/json',
    // Añade la cabecera 'Authorization' con el token si existe, en el formato 'Bearer'.
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Define una función genérica y reutilizable para hacer todas las peticiones a la API.
const apiFetch = async (endpoint, options = {}) => {
  // Realiza la petición 'fetch' a la URL completa, combinando la URL base, el prefijo '/api' y el endpoint específico.
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    // Combina las opciones personalizadas (como 'method' y 'body') con las opciones por defecto.
    ...options,
    // Añade las cabeceras de autenticación a la petición.
    headers: getAuthHeaders(),
  });

  // Si la respuesta de la petición no es exitosa (ej. status 400, 404, 500)...
  if (!response.ok) {
    // ...intenta parsear el cuerpo de la respuesta para obtener el mensaje de error del backend.
    const errorData = await response.json();
    // Lanza un nuevo error con el mensaje del backend o un mensaje genérico.
    throw new Error(errorData.message || 'Algo salió mal');
  }
  // Si la respuesta es exitosa, parsea el cuerpo como JSON y lo devuelve.
  return response.json();
};

// --- Funciones para Autenticación ---
// Exporta una función para iniciar sesión, que llama a 'apiFetch' con el método POST y las credenciales.
export const loginUser = (credentials) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

// Exporta una función para registrar un nuevo usuario.
export const registerUser = (userData) => apiFetch('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData)
});

// Exporta una función para cambiar la contraseña.
export const changePassword = (passwords) => apiFetch('/auth/change-password', {
  method: 'PUT',
  body: JSON.stringify(passwords)
});

// Exporta una función para obtener los datos del usuario logueado.
export const getMe = () => apiFetch('/auth/me');

// --- Funciones para Inventario (Productos) ---
// Exporta una función para añadir un nuevo producto.
export const addProduct = (productData) => apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) });
// Exporta una función para actualizar un producto existente por su ID.
export const updateProduct = (id, productData) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
// Exporta una función para eliminar un producto por su ID.
export const deleteProduct = (id) => apiFetch(`/products/${id}`, { method: 'DELETE' });

// --- Funciones de Inventario Específicas ---

// Computadores
export const getComputers = () => apiFetch('/products');

// Comidas
export const getMeals = () => apiFetch('/meals');
export const addMeal = (mealData) => apiFetch('/meals', { method: 'POST', body: JSON.stringify(mealData) });
export const updateMeal = (id, mealData) => apiFetch(`/meals/${id}`, { method: 'PUT', body: JSON.stringify(mealData) });
export const deleteMeal = (id) => apiFetch(`/meals/${id}`, { method: 'DELETE' });

// Ingredientes
export const getIngredients = () => apiFetch('/ingredients');

// Licencias
export const getLicenses = () => apiFetch('/licenses');