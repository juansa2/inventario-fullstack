// Importa la librería principal de React.
import React from 'react';
// Importa 'ReactDOM' para renderizar la aplicación en el DOM del navegador.
import ReactDOM from 'react-dom/client';
// Importa el componente principal de la aplicación, 'App'.
import App from './App.jsx';
// Importa los estilos globales de la aplicación.
import './index.css';
// Importa 'BrowserRouter' para habilitar el enrutamiento basado en la URL del navegador.
import { BrowserRouter } from 'react-router-dom';
// Importa el 'AuthProvider' desde nuestro contexto de autenticación.
import { AuthProvider } from './context/AuthContext.jsx';

// Obtiene el elemento raíz del HTML y crea el punto de entrada para la aplicación de React.
ReactDOM.createRoot(document.getElementById('root')).render(
  // 'React.StrictMode' es un componente que ayuda a detectar problemas potenciales en la aplicación.
  <React.StrictMode>
    {/* 'BrowserRouter' envuelve la aplicación para gestionar las rutas. */}
    <BrowserRouter>
      {/* 'AuthProvider' envuelve la aplicación para que todos los componentes hijos puedan acceder al contexto de autenticación. */}
      <AuthProvider>
        {/* Renderiza el componente principal de la aplicación. */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);