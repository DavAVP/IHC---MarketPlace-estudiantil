import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { supabase } from '../../../supabase.config';

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

    // ✅ Validación de contraseña
    if (password.length < 6) {
      setError('La contraseña es insegura. Debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // 1️⃣ Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: correo,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se creó el usuario en Auth');

      const authId = authData.user.id;

      // 2️⃣ Insertar en tabla Usuarios
      const { data: usuarioDB, error: dbError } = await supabase
        .from('Usuarios')
        .insert({
          auth_id: authId,
          nombre,
          correo,
          isAdmin: false,
        })
        .select();

      if (dbError) throw dbError;
      if (!usuarioDB || usuarioDB.length === 0)
        throw new Error('No se guardó el usuario en la tabla');

      // 3️⃣ Guardar en contexto y redirigir
      setUsuario(usuarioDB[0]);
      navigate('/home');

    } catch (err: any) {
      console.error('Error registro:', err);
      setError(err.message || 'Ocurrió un error durante el registro');
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
