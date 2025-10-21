import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { Usuario } from '../../data/MockUsuarios';

const Login: React.FC = () => {
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = Usuario.find(u => u.correo === correo && u.password === password);

    if (!user) {
      setError('Correo o contraseña incorrectos');
      return;
    }

    setUsuario(user);
    navigate('/home');
  };

  return (
    <div className="page-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Ingresar</button>
        </form>

        <p style={{ marginTop: '12px' }}>
          ¿No tienes cuenta?{' '}
          <span
            style={{ color: '#0077cc', cursor: 'pointer' }}
            onClick={() => navigate('/registro')}
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
