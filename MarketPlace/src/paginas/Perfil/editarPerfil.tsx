import React, { useEffect, useState } from 'react';
import type { IUsuario } from '../../entidades/IUsuario';
import { supabase } from '../../data/supabase.config'

export interface IUsuarioProp {
  usuario?: IUsuario | null;
}

export const EditarPerfil: React.FC<IUsuarioProp> = ({ usuario }) => {
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setNombre(usuario?.nombre ?? '');
    setCorreo(usuario?.correo ?? '');
    setContrasena('');
    setMensaje('');
  }, [usuario]);

  const validarEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMensaje('');

    if (!usuario?.id) {
      setMensaje('Usuario no disponible.');
      return; // <-- importante
    }
    if (!nombre.trim()) {
      setMensaje('El nombre es requerido.');
      return;
    }
    if (!validarEmail(correo)) {
      setMensaje('Ingrese un correo válido.');
      return;
    }
    if (contrasena && contrasena.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const updates: Partial<IUsuario> = {
        nombre: nombre.trim(),
        correo: correo.trim()
      };

      const { error: dbError } = await supabase
        .from('Usuarios')
        .update(updates)
        .eq('id', usuario.id);

      if (dbError) throw dbError;

      if (contrasena) {
        const { error: authError } = await supabase.auth.updateUser({ 
          password: contrasena 
        });
        
        if (authError) throw authError;
      }

      setMensaje('Cambios guardados correctamente.');
      setContrasena('');
    } catch (err: any) {
      console.error(err);
      setMensaje(err?.message ?? 'Error al guardar cambios.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="editar-perfil">
      <h3>Editar perfil</h3>

      <form onSubmit={handleSubmit} className="form-editar-perfil">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label htmlFor="contrasena">Contraseña (opcional)</label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {mensaje && <p className="mensaje-resultado">{mensaje}</p>}
      </form>
    </div>
  );
};

export default EditarPerfil;