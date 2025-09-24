// Importa React y el hook 'useState' para el estado del formulario.
import React, { useState } from 'react';
// Importa 'useNavigate' para redirigir al usuario.
import { useNavigate } from 'react-router-dom';
// Importa la función centralizada para cambiar la contraseña desde el servicio de API.
import { changePassword as apiChangePassword } from '../services/api';

// Define el componente de la página para cambiar la contraseña.
const ChangePasswordPage = () => {
  // Define estados para los campos de contraseña, mensajes de éxito/error y estado de carga.
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Obtiene la función 'navigate' para la redirección.
  const navigate = useNavigate();

  // Define la función que se ejecuta al enviar el formulario.
  const handleSubmit = async (e) => {
    // Previene el comportamiento por defecto del formulario.
    e.preventDefault();
    // Limpia los mensajes anteriores.
    setMessage('');
    setError('');

    // Valida que las nuevas contraseñas coincidan.
    if (newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    // Activa el estado de carga.
    setIsLoading(true);

    try {
      // Llama a la función centralizada de la API para cambiar la contraseña.
      await apiChangePassword({ currentPassword, newPassword });

      // Si es exitoso, muestra un mensaje de éxito.
      setMessage('Contraseña actualizada con éxito. Serás redirigido en 3 segundos.');
      // Configura una redirección a la página de inventario después de 3 segundos.
      setTimeout(() => {
        navigate('/inventory');
      }, 3000);

    } catch (err) {
      // Si ocurre un error, lo muestra en el estado 'error'.
      setError(err.message);
    } finally {
      // Desactiva el estado de carga, independientemente del resultado.
      setIsLoading(false);
    }
  };

  // Renderiza el JSX de la página.
  return (
    <div className="form-container">
      <h2>Cambiar Contraseña</h2>
      {/* Asocia la función 'handleSubmit' al evento 'onSubmit'. */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Contraseña Actual</label>
          {/* Campo para la contraseña actual, controlado por su estado. */}
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          {/* Campo para la nueva contraseña. */}
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          {/* Campo para confirmar la nueva contraseña. */}
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* Botón de envío, deshabilitado durante la carga. */}
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
      {/* Muestra mensajes de éxito o error según el estado. */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

// Exporta el componente.
export default ChangePasswordPage;