import React from 'react';
import EditarPerfil from '../Edicion/editarPerfil';
import type { IUsuario } from '../entidades/Usuario';

export const Perfil: React.FC = () => {
  return (
    <div>
      <h1>Configuración de la Cuenta</h1>
      <p>Aquí puedes configurar las opciones de tu cuenta.</p>
    </div>

    {/* Funcion para editar Perfil */}
    <div className='editar-perfil'>
        <h2>Editar Perfil</h2>
            {usuario ? <EditarPerfil usuario={usuario} /> : <p>Inicia sesión para editar tu perfil.</p>}
    </div>
  );
}