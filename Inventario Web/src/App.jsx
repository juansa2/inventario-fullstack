// src/App.jsx
import React from 'react';
// --- 1. CORREGIR LA IMPORTACIÓN ---
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
// No necesitas importar PrivateRoute si lo defines aquí mismo
import './App.css';

// Nuestro componente "Guardia de Seguridad"
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
      <div className="app">
        <header className="App-header">
            <h1>Sistema de Inventario</h1>
            <nav>
              {/* ... */}
            </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Tu código para las rutas protegidas ya es correcto */}
            <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
  );
}

export default App;