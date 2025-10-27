import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { authService } from '../../services/auth.services';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();

  // Estados principales
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recordarme, setRecordarme] = useState(false);

  // Seguridad y bloqueo temporal
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const bloqueoRef = useRef<number | null>(null);

  // Precargar correo guardado
  useEffect(() => {
    const savedEmail = localStorage.getItem('recordarEmail');
    if (savedEmail) {
      setCorreo(savedEmail);
      setRecordarme(true);
    }
  }, []);

  // Manejo de intentos fallidos
  const manejarIntentosFallidos = () => {
    const nuevosIntentos = intentosFallidos + 1;
    setIntentosFallidos(nuevosIntentos);

    if (nuevosIntentos >= 3) {
      setBloqueado(true);
      toast.error('⚠️ Demasiados intentos fallidos. Espera 30 segundos.');
      bloqueoRef.current = setTimeout(() => {
        setIntentosFallidos(0);
        setBloqueado(false);
        toast.success('✅ Puedes volver a intentar iniciar sesión.');
      }, 30000);
    } else {
      toast.error(`Intento ${nuevosIntentos} de 3 fallido.`);
    }
  };

  // Limpieza al desmontar el componente (buena práctica)
  useEffect(() => {
    return () => {
      if (bloqueoRef.current) {
        window.clearTimeout(bloqueoRef.current);
      }
    };
  }, []);

  // 🔐 Login normal con email y contraseña
  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (bloqueado) {
      toast.error('⛔ Cuenta bloqueada temporalmente. Espera unos segundos.');
      return;
    }

    try {
      const usuario = await authService.loginWithEmail(correo, password);

      if (!usuario) {
        manejarIntentosFallidos();
        setError('Correo o contraseña incorrectos');
        return;
      }

      // Guardar usuario en contexto
      setUsuario(usuario);
      sessionStorage.setItem('user', JSON.stringify(usuario));

      // Guardar email si el usuario marca "recordarme"
      if (recordarme) {
        localStorage.setItem('recordarEmail', correo);
      } else {
        localStorage.removeItem('recordarEmail');
      }

      // Reiniciar intentos fallidos
      setIntentosFallidos(0);

      toast.success('🎉 Inicio de sesión exitoso');
      alert(`Bienvenido ${usuario.nombre || 'usuario'} 😎`);
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      manejarIntentosFallidos();
      setError(err.message || 'Error en el login');
    }
  };

  // 🔹 Login con Google
  const handleLoginGoogle = async () => {
    try {
      await authService.loginWithGoogle();
      alert('Inicio de sesión con Google completado 🎉');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // 🔹 Login con GitHub
  const handleLoginGithub = async () => {
    try {
      await authService.loginWithGithub();
      alert('Inicio de sesión con GitHub completado 🎉');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // 🔹 Recuperar contraseña
  const handleRecuperarPassword = async () => {
    if (!correo) {
      toast.error('Por favor ingresa tu correo primero.');
      return;
    }

    try {
      const { error } = await authService.resetPassword(correo);
      if (error) throw error;
      toast.success('📧 Correo de recuperación enviado.');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al enviar correo de recuperación.');
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
      <Toaster position="top-right" />

      <div
        style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          width: '900px',
          maxWidth: '95%',
          height: '500px',
        }}
      >
        {/* Panel Izquierdo */}
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

        {/* Panel Derecho */}
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

          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

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
              disabled={bloqueado}
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
              disabled={bloqueado}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={recordarme}
                onChange={() => setRecordarme(!recordarme)}
                style={{ marginRight: '5px' }}
              />
              Recordar usuario
            </label>

            <button
              type="submit"
              disabled={bloqueado}
              style={{
                width: '100%',
                backgroundColor: bloqueado ? '#aaa' : '#0077cc',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: bloqueado ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
              }}
            >
              {bloqueado ? 'Bloqueado...' : 'Ingresar'}
            </button>
          </form>

          <p
            style={{
              marginTop: '10px',
              color: '#0077cc',
              cursor: 'pointer',
              textAlign: 'center',
            }}
            onClick={handleRecuperarPassword}
          >
            ¿Olvidaste tu contraseña?
          </p>

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
