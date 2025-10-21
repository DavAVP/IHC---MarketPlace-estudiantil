import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { supabase } from '../../../supabase.config';

const Login: React.FC = () => {
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password
      });

      if (authError || !data.user) {
        setError('Correo o contraseña incorrectos');
        return;
      }

      // Opcional: traer datos adicionales de tu tabla 'usuarios'
      const { data: usuarioDB, error: dbError } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('auth_id', data.user.id) 
        .maybeSingle();

      if (!usuarioDB) {
        setError('Usuario no encontrado en la base de datos');
        return;
      }
      setUsuario(usuarioDB);
      navigate('/home');

    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error en el login');
    }
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
