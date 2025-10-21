import React from 'react';
import EditarPerfil from '../Edicion/editarPerfil';
import { useUsuario } from '../../context/UsuarioContext';

export const Perfil: React.FC = () => {
  const { usuario } = useUsuario(); // traemos el usuario desde el context

  return (
    <div>
      <h1>Configuración de la Cuenta</h1>
      <p>Aquí puedes configurar las opciones de tu cuenta.</p>

      {/* Sección de edición de perfil */}
      <div className="editar-perfil">
        <h2>Editar Perfil</h2>
        {usuario ? (
          <EditarPerfil usuario={usuario} />
        ) : (
          <p>Inicia sesión para editar tu perfil.</p>
        )}
      </div>
    </div>
  );
};