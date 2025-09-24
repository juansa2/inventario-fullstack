// Importa las funcionalidades de React: el núcleo, la creación de contexto, y los hooks 'useState', 'useContext', 'useEffect'.
import React, { createContext, useState, useContext, useEffect } from 'react';
// Importa la función 'getMe' desde 'api.js' para obtener los datos del usuario autenticado.
import { getMe } from '../services/api';

// Crea un nuevo Contexto de React. 'null' es el valor inicial por defecto.
const AuthContext = createContext(null);

// Define el componente 'AuthProvider', que proveerá el contexto a sus componentes hijos.
export const AuthProvider = ({ children }) => {
  // Define un estado 'user' para almacenar los datos del usuario logueado.
  const [user, setUser] = useState(null);
  // Define un estado 'loading' para saber si se están cargando los datos del usuario.
  const [loading, setLoading] = useState(true);
  // Obtiene el token del almacenamiento local.
  const token = localStorage.getItem('token');

  // Hook 'useEffect' que se ejecuta cuando el valor de 'token' cambia.
  useEffect(() => {
    // Define una función asíncrona para buscar los datos del usuario.
    const fetchUser = async () => {
      // Si existe un token...
      if (token) {
        try {
          // ...intenta obtener los datos del usuario llamando a la API.
          const userData = await getMe();
          // Si tiene éxito, actualiza el estado 'user'.
          setUser(userData);
        } catch (error) {
          // Si falla (ej. token expirado o inválido), muestra un error en consola.
          console.error("Error al obtener el usuario, el token puede ser inválido.", error);
          // Limpia el token inválido del almacenamiento local.
          localStorage.removeItem('token');
          // Asegura que el estado del usuario sea nulo.
          setUser(null);
        }
      }
      // Una vez terminado el proceso (con o sin token), establece 'loading' a 'false'.
      setLoading(false);
    };

    // Llama a la función para que se ejecute.
    fetchUser();
  }, [token]);

  // Define la función 'login' que será accesible desde el contexto.
  const login = async (credentials) => {
    // Llama a la API para iniciar sesión.
    const userData = await getMe(); // Re-utilizamos getMe para obtener los datos del usuario tras el login.
    // Actualiza el estado del usuario con los datos recibidos.
    setUser(userData);
  };

  // Define la función 'logout' que será accesible desde el contexto.
  const logout = () => {
    // Elimina el token del almacenamiento local.
    localStorage.removeItem('token');
    // Resetea el estado del usuario a nulo.
    setUser(null);
  };

  // Crea el objeto 'value' que contendrá todos los datos y funciones que el proveedor hará disponibles.
  const value = { user, isAuthenticated: !!user, loading, login, logout };

  // Renderiza el proveedor del contexto, pasando el objeto 'value' y renderizando los componentes hijos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Define un hook personalizado 'useAuth' para consumir fácilmente el contexto en otros componentes.
export const useAuth = () => {
  // Devuelve el valor del 'AuthContext'.
  return useContext(AuthContext);
};