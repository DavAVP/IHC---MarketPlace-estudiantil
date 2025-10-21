import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '../../data/MockUsuarios';
import type { IUsuario } from '../../entidades/IUsuario';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !correo || !password) {
      setError('Completa todos los campos');
      return;
    }

    const existe = Usuario.find(u => u.correo === correo);
    if (existe) {
      setError('El correo ya está registrado');
      return;
    }

    const nuevoUsuario: IUsuario = {
      id_usuario: Usuario.length + 1,
      nombre,
      correo,
      password,
      esAdmin: false, // ⚙️ Solo se asigna manualmente desde el sistema
      fotoPerfil: ''
    };

    Usuario.push(nuevoUsuario);
    alert('Cuenta creada con éxito 🎉');
    navigate('/login');
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
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
