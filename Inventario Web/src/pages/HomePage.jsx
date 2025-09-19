// src/pages/HomePage.jsx

import { Link } from 'react-router-dom';
import './HomePage.css'; // Importaremos un archivo de estilos

function HomePage() {
  return (
    <div className="home-container">
      <h1>Bienvenido al Gestor de Inventario</h1>
      <p>La solución definitiva para gestionar tus equipos de cómputo.</p>
      <div className="home-actions">
        <Link to="/login" className="home-button primary">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="home-button secondary">
          Crear Cuenta
        </Link>
      </div>
    </div>
  );
}

export default HomePage;