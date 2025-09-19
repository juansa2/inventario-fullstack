// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forms.css'; // Usaremos un archivo de estilos común para los formularios

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirigir al usuario

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Limpiar errores anteriores

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el servidor responde con un error (ej. email ya existe)
        throw new Error(data.message || 'Error al registrar el usuario.');
      }

      // Si el registro es exitoso, redirigimos al login
      navigate('/login');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>Crear Nueva Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Correo Electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;