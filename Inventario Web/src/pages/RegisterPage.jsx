// filepath: d:/Programacion/Ejemplo Pagina Web Inventarios/Inventario Web/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Importamos la función de registro
import { registerUser } from '../services/api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 2. Usamos la función importada
      const data = await registerUser({ username, email, password });

      localStorage.setItem('token', data.token);
      navigate('/inventory');
    } catch (err) {
      setError(err.message || 'Error al registrarse. Intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
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
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="form-switch">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default RegisterPage;