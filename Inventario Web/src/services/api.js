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

// --- Funciones para Autenticación ---
export const loginUser = (credentials) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

export const registerUser = (userData) => apiFetch('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData)
});

export const changePassword = (passwords) => apiFetch('/auth/change-password', {
  method: 'PUT',
  body: JSON.stringify(passwords)
});

// --- Funciones para Inventario (Productos) ---
export const getInventory = () => apiFetch('/products');
export const addProduct = (productData) => apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) });
export const updateProduct = (id, productData) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
export const deleteProduct = (id) => apiFetch(`/products/${id}`, { method: 'DELETE' });