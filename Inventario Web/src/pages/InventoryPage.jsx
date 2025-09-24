// Importa React y los hooks necesarios.
import React from 'react';
// Importa componentes de 'react-router-dom' para la navegación.
import { Link, useNavigate } from 'react-router-dom';
// Importa el hook de autenticación para acceder a los datos del usuario y la función de logout.
import { useAuth } from '../context/AuthContext.jsx'; // Importamos el hook de autenticación
// Importa los estilos para esta página de menú.
import './InventoryPage.css';

// Define el componente de la página del menú de inventarios.
function InventoryPage() {
  // Obtiene los datos del usuario, el estado de carga y la función de logout del contexto.
  const { user, logout, loading } = useAuth(); // Usamos el contexto para obtener el usuario y la función de logout
  // Obtiene la función para navegar programáticamente.
  const navigate = useNavigate();

  // Define la función para manejar el cierre de sesión.
  const handleLogout = () => {
    logout(); // Usamos la función de logout del contexto
    navigate('/');
  };

  // Muestra un mensaje de carga mientras se verifica la sesión.
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Renderiza el menú de inventarios.
  return (
    <>
      <div className="user-actions">
        {user && <span className="user-greeting">Hola, {user.email}</span>}
        <Link to="/change-password" className="action-link">Cambiar Contraseña</Link>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>
      <div className="inventory-menu-container">
        <h2>Menú de Inventarios</h2>
        <div className="inventory-menu">
          <Link to="/inventory/computers" className="menu-item">Inventario de Equipos</Link>
          <Link to="/inventory/meals" className="menu-item">Inventario de Comidas</Link>
          <Link to="/inventory/ingredients" className="menu-item">Inventario de Ingredientes</Link>
          <Link to="/inventory/licenses" className="menu-item">Inventario de Licencias</Link>
        </div>
      </div>
    </>
  );
}

export default InventoryPage;