// Importa React y el hook 'useState' para manejar el estado del formulario.
import React, { useState } from 'react';
// Importa 'Link' para la navegación y 'useNavigate' para redirigir programáticamente.
import { Link, useNavigate } from 'react-router-dom';
// Importa la función 'loginUser' desde nuestro archivo de servicios de API.
import { loginUser } from '../services/api';
// Importa el hook 'useAuth' para acceder a la función de login del contexto.
import { useAuth } from '../context/AuthContext';

// Define el componente de la página de inicio de sesión.
const LoginPage = () => {
  // Define estados para los campos del formulario, mensajes de error y estado de carga.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Obtiene la función 'login' del contexto de autenticación.
  const { login } = useAuth();
  // Obtiene la función 'navigate' para redirigir al usuario después del login.
  const navigate = useNavigate();

  // Define la función que se ejecuta al enviar el formulario.
  const handleSubmit = async (e) => {
    // Previene el comportamiento por defecto del formulario (recargar la página).
    e.preventDefault();
    // Limpia cualquier error anterior y activa el estado de carga.
    setError('');
    setIsLoading(true);

    try {
      // Llama a la función 'loginUser' de la API con las credenciales del formulario.
      const data = await loginUser({ email, password });
      // Llama a la función 'login' del contexto, pasándole el nuevo token.
      login(data.token);
      // Redirige al usuario a la página principal del inventario.
      navigate('/inventory');
    } catch (err) {
      // Si ocurre un error (ej. credenciales incorrectas), actualiza el estado 'error' con el mensaje de la API.
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      // Se ejecuta siempre, tanto si hay éxito como si hay error. Desactiva el estado de carga.
      setIsLoading(false);
    }
  };

  // Renderiza el JSX de la página.
  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      {/* Asocia la función 'handleSubmit' al evento 'onSubmit' del formulario. */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          {/* Campo de email, controlado por el estado 'email'. */}
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          {/* Campo de contraseña, controlado por el estado 'password'. */}
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {/* Botón de envío. Se deshabilita y cambia de texto mientras 'isLoading' es verdadero. */}
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
      {/* Muestra el mensaje de error si el estado 'error' tiene un valor. */}
      {error && <p className="error-message">{error}</p>}
      {/* Enlace para que los usuarios sin cuenta vayan a la página de registro. */}
      <p className="form-switch">
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

// Exporta el componente para ser usado en App.jsx.
export default LoginPage;