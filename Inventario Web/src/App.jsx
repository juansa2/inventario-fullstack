// Importa la librería principal de React.
import React from 'react';
// Importa los componentes necesarios de 'react-router-dom' para definir y gestionar las rutas.
import { Routes, Route, Navigate } from 'react-router-dom';
// Importa los componentes de página que se mostrarán según la ruta.
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
// Importa la nueva página de inventario de computadores
import ComputersPage from './pages/ComputersPage';
// Importa la nueva página de inventario de comidas
import MealsPage from './pages/MealsPage';
// Importa las nuevas páginas de inventario
import IngredientsPage from './pages/IngredientsPage';
import LicensesPage from './pages/LicensesPage';
// Importa el hook 'useAuth' para acceder al estado de autenticación.
import { useAuth } from './context/AuthContext';
// Importa los estilos CSS principales de la aplicación.
import './App.css';

// Define un componente 'ProtectedRoute' mejorado que utiliza el contexto de autenticación.
const ProtectedRoute = ({ children }) => {
  // Obtiene el estado de autenticación y carga desde el AuthContext.
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica el estado de autenticación, muestra un mensaje de carga.
  // Esto evita redirecciones prematuras o parpadeos en la interfaz.
  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  // Si la carga ha terminado y el usuario no está autenticado...
  if (!isAuthenticated) {
    // ...redirige al usuario a la página de inicio de sesión.
    return <Navigate to="/login" />;
  }
  // Si el usuario está autenticado, renderiza el componente hijo (la página protegida).
  return children;
};

// Define el componente principal de la aplicación.
function App() {
  return (
      // Contenedor principal que aplica estilos de centrado y diseño desde 'App.css'.
      <div className="app-container">
        {/* Título principal de la aplicación. */}
        <h1>Sistema de Inventario</h1>
        <main>
          {/* El componente 'Routes' envuelve todas las definiciones de rutas individuales. */}
          <Routes>
            {/* Define las rutas públicas que no requieren autenticación. */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Define las rutas protegidas, envolviendo el componente de la página con 'ProtectedRoute'. */}
            <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
            {/* Nueva ruta específica para el inventario de computadores. */}
            <Route path="/inventory/computers" element={<ProtectedRoute><ComputersPage /></ProtectedRoute>} />
            {/* Nueva ruta específica para el inventario de comidas. */}
            <Route path="/inventory/meals" element={<ProtectedRoute><MealsPage /></ProtectedRoute>} />
            {/* Nuevas rutas para ingredientes y licencias */}
            <Route path="/inventory/ingredients" element={<ProtectedRoute><IngredientsPage /></ProtectedRoute>} />
            <Route path="/inventory/licenses" element={<ProtectedRoute><LicensesPage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
  );
}

// Exporta el componente 'App' para que pueda ser usado en 'main.jsx'.
export default App;