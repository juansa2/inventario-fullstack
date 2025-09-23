// filepath: d:/Programacion/Ejemplo Pagina Web Inventarios/Inventario Web/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Función genérica para peticiones
const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Algo salió mal');
  }
  return response.json();
};

// Exportar funciones específicas
export const loginUser = (credentials) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

export const getInventory = () => apiFetch('/products');

export const addProduct = (productData) => apiFetch('/products', {
  method: 'POST',
  body: JSON.stringify(productData)
});

// filepath: d:/Programacion/Ejemplo Pagina Web Inventarios/Inventario Web/src/services/api.js
// ...existing code...
// --- Funciones para Autenticación ---
export const loginUser = (credentials) => apiFetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

// --- AÑADIR ESTA FUNCIÓN ---
export const registerUser = (userData) => apiFetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData)
});
// ... y así para todas las demás peticiones (delete, update, etc.)