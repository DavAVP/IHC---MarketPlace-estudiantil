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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e8f0fe',
      }}
    >
      <div
        style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          width: '900px',
          maxWidth: '95%',
          height: '500px', // 🔹 Ambos paneles tendrán la misma altura
        }}
      >
        {/* 🔹 Panel Izquierdo */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              color: '#0077cc',
              fontWeight: 'bold',
              fontSize: '2rem',
              marginBottom: '20px',
            }}
          >
            Feria ULEAM
          </h1>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', textAlign: 'justify' }}>
            Bienvenido a la <strong>Feria de Emprendimientos Estudiantiles</strong> de la
            Universidad Laica Eloy Alfaro de Manabí (ULEAM).
          </p>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', textAlign: 'justify' }}>
            Un <strong>marketplace estudiantil</strong> donde los alumnos pueden subir, mostrar y vender
            sus productos o proyectos. No es necesario participar en la feria para publicar.
          </p>
          <p style={{ color: '#555', lineHeight: '1.6', textAlign: 'justify' }}>
            Crea tu cuenta, publica tus productos y conecta con otros emprendedores de la ULEAM.
          </p>
        </div>

        {/* 🔹 Panel Derecho */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#fefefe',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderLeft: '1px solid #eee',
          }}
        >
          <h2
            style={{
              marginBottom: '10px',
              textAlign: 'center',
              color: '#0077cc',
              fontWeight: 'bold',
            }}
          >
            Iniciar Sesión
          </h2>
          {error && (
            <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={handleLoginGoogle}
              style={{
                backgroundColor: '#db4437',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                fontWeight: 'bold',
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
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                fontWeight: 'bold',
              }}
            >
              GitHub
            </button>
          </div>

          <form onSubmit={handleLoginEmail}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#0077cc',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Ingresar
            </button>
          </form>

          <p style={{ marginTop: '12px', textAlign: 'center' }}>
            ¿No tienes cuenta?{' '}
            <span
              style={{ color: '#0077cc', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => navigate('/registro')}
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
