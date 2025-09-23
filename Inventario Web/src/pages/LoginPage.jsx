import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Importamos la función de login desde nuestro servicio
import { loginUser } from '../services/api';

const LoginPage = () => {
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
      // 2. Usamos la función importada. ¡Mucho más limpio!
      const data = await loginUser({ email, password });
      
      localStorage.setItem('token', data.token);
      navigate('/inventory');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="form-switch">
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default LoginPage;