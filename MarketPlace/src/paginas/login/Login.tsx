import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { authService } from '../../services/auth.services';

const Login: React.FC = () => {
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const usuario = await authService.loginWithEmail(correo, password);
      if (!usuario) {
        setError('Correo o contraseña incorrectos');
        return;
      }
      setUsuario(usuario);
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error en el login');
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleLoginGithub = async () => {
    try {
      await authService.loginWithGithub();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLoginEmail}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

        <p style={{ marginTop: '12px' }}>O inicia sesión con tus redes:</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            onClick={handleLoginGoogle}
            style={{
              backgroundColor: '#db4437',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Google
          </button>
          <button
            onClick={handleLoginGithub}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
