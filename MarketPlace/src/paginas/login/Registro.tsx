import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { authService } from '../../services/auth.services';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUsuario } = useUsuario();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre || !correo || !password) {
      setError('Completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const usuario = await authService.registerWithEmail(correo, password, nombre);
      if (!usuario) throw new Error('No se pudo registrar el usuario');

      setUsuario(usuario);
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error en el registro');
    }
  };

  return (
    <div className="page-container">
      <div className="login-card">
        <h2>Crear Cuenta</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegistro}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
