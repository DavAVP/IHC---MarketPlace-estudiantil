import React, { useState, useEffect } from 'react';
import { useUsuario } from '../../context/UsuarioContext';
import { UsuarioServices } from '../../services/usuario.services';
import { supabase } from '../../data/supabase.config';
import Sidebar from "../../componentes/SideBar";
import Navbar from "../../componentes/NavBar";
import Footer from "../../componentes/footer";
import '../../assets/estilosPerfil/perfil.css';

export const Perfil: React.FC = () => {
  const { usuario } = useUsuario();

  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre ?? '');
      setCorreo(usuario.correo ?? '');
    }
  }, [usuario]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMensaje('');

    if (!usuario?.id) {
      setMensaje('Usuario no disponible.');
      return;
    }
    if (!nombre.trim()) {
      setMensaje('El nombre es requerido.');
      return;
    }
    if (contrasena && contrasena.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // 🔹 1. Actualizar solo el nombre en la base de datos
      const updates = { nombre: nombre.trim() };
      const actualizado = await UsuarioServices.ActualizarUsuario(usuario.id, updates);

      if (!actualizado) throw new Error('Error al actualizar en la base de datos.');

      // 🔹 2. Actualizar contraseña (solo si se modificó)
      if (contrasena) {
        const { error: authError } = await supabase.auth.updateUser({ password: contrasena });
        if (authError) throw authError;
      }

      setMensaje('✅ Cambios guardados correctamente.');
      setContrasena('');
    } catch (err: any) {
      console.error('Error al guardar cambios:', err);
      setMensaje(err?.message ?? 'Error al guardar cambios.');
    } finally {
      setLoading(false);
    }
  };

  const getMensajeClass = () => {
    if (mensaje.includes('Error') || mensaje.includes('requerido')) {
      return 'text-red';
    }
    return 'text-green';
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <Navbar onSearch={() => {}} />

        <main className="perfil-container">
          <div className="perfil-header">
            <h1>👤 Perfil de Usuario</h1>
            <p>Consulta tu información y actualízala cuando quieras.</p>
          </div>

          {usuario ? (
            <>
              <div className="perfil-info">
                <h2>Información actual</h2>
                <div className="info-grid">
                  <div>
                    <strong>Nombre:</strong>
                    <p>{usuario.nombre}</p>
                  </div>
                  <div>
                    <strong>Correo:</strong>
                    <p>{usuario.correo}</p>
                  </div>
                </div>
              </div>

              <div className="editar-perfil">
                <h2>Editar información</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo">Correo</label>
                    <input
                      id="correo"
                      type="email"
                      value={correo}
                      disabled // 🔒 ya no editable
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contrasena">Contraseña (opcional)</label>
                    <input
                      id="contrasena"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-guardar">
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </button>

                  {mensaje && (
                    <p className={`mensaje-resultado ${getMensajeClass()}`}>
                      {mensaje}
                    </p>
                  )}
                </form>
              </div>
            </>
          ) : (
            <p className="text-gray">
              Por favor, inicia sesión para ver tu perfil.
            </p>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Perfil;
