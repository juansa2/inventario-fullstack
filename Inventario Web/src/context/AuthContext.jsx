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
  // Define un estado para el token, inicializándolo desde localStorage.
  const [token, setToken] = useState(localStorage.getItem('token'));
  // Define un estado 'loading' para la verificación inicial de la sesión.
  const [loading, setLoading] = useState(true);
  // Define un estado 'isAuthLoading' para operaciones como login/logout.
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Hook 'useEffect' que se ejecuta cuando el valor de 'token' cambia.
  useEffect(() => {
    // Actualiza localStorage cada vez que el estado del token cambie.
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

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
          // Limpia el token y el usuario del estado.
          setToken(null);
          setUser(null);
        }
      } else {
        // Si no hay token, asegura que el usuario sea nulo.
        setUser(null);
      }
      // Una vez terminada la verificación inicial, establece 'loading' a 'false'.
      setLoading(false);
    };

    // Llama a la función para que se ejecute.
    fetchUser();
  }, [token]); // Este efecto se ejecuta cada vez que el token cambia.

  // Define la función 'login' que será accesible desde el contexto.
  const login = (newToken) => {
    // Activa el estado de carga de autenticación.
    setIsAuthLoading(true);
    // Actualiza el estado del token, lo que disparará el useEffect para obtener los datos del usuario.
    setToken(newToken);
  };

  // Define la función 'logout' que será accesible desde el contexto.
  const logout = () => {
    // Activa el estado de carga de autenticación.
    setIsAuthLoading(true);
    // Establece el token a null, lo que disparará el useEffect para limpiar el estado.
    setToken(null);
  };

  // Crea el objeto 'value' que contendrá todos los datos y funciones que el proveedor hará disponibles.
  // El estado de carga general es la combinación de la carga inicial Y la carga de autenticación.
  const value = { user, isAuthenticated: !!user, loading: loading || isAuthLoading, login, logout };

  // Renderiza el proveedor del contexto, pasando el objeto 'value' y renderizando los componentes hijos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Define un hook personalizado 'useAuth' para consumir fácilmente el contexto en otros componentes.
export const useAuth = () => {
  // Devuelve el valor del 'AuthContext'.
  return useContext(AuthContext);
};