// Importa React y el hook 'useState' para manejar el estado del formulario.
import React, { useState } from 'react';
// Importa 'Link' para la navegación y 'useNavigate' para redirigir programáticamente.
import { Link, useNavigate } from 'react-router-dom';
// Importa la función 'registerUser' desde nuestro archivo de servicios de API.
import { registerUser } from '../services/api';
// Importa el hook 'useAuth' para acceder a la función de login del contexto.
import { useAuth } from '../context/AuthContext';

// Define el componente de la página de registro.
const RegisterPage = () => {
  // Define estados para los campos del formulario, mensajes de error y estado de carga.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Obtiene la función 'login' del contexto para iniciar sesión automáticamente después del registro.
  const { login } = useAuth();
  // Obtiene la función 'navigate' para redirigir al usuario después del registro.
  const navigate = useNavigate();

  // Define la función que se ejecuta al enviar el formulario.
  const handleSubmit = async (e) => {
    // Previene el comportamiento por defecto del formulario.
    e.preventDefault();
    // Limpia cualquier error anterior y activa el estado de carga.
    setError('');
    setIsLoading(true);

    try {
      // Llama a la función 'registerUser' de la API con los datos del formulario.
      await registerUser({ name, email, password });

      // Después de un registro exitoso, llama a la función 'login' del contexto para
      // iniciar sesión automáticamente con las mismas credenciales.
      await login({ email, password });

      // Redirige al usuario a la página de inventario.
      navigate('/inventory');
    } catch (err) {
      // Si ocurre un error, actualiza el estado 'error' con el mensaje recibido de la API.
      setError(err.message || 'Error al registrarse. Intente de nuevo.');
    } finally {
      // Se ejecuta siempre, tanto si hay éxito como si hay error. Desactiva el estado de carga.
      setIsLoading(false);
    }
  };

  // Renderiza el JSX de la página.
  return (
    <div className="form-container">
      <h2>Registro de Nuevo Usuario</h2>
      {/* Asocia la función 'handleSubmit' al evento 'onSubmit' del formulario. */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre Completo</label>
          {/* Campo de texto para el nombre de usuario, controlado por el estado 'username'. */}
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          {/* Campo de email, controlado por el estado 'email'. */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          {/* Campo de contraseña, controlado por el estado 'password'. */}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Botón de envío. Se deshabilita y cambia de texto mientras 'isLoading' es verdadero. */}
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {/* Muestra el mensaje de error si el estado 'error' tiene un valor. */}
      {error && <p className="error-message">{error}</p>}
      {/* Enlace para que los usuarios que ya tienen cuenta vayan a la página de login. */}
      <p className="form-switch">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

// Exporta el componente.
export default RegisterPage;