import React, { useState, useEffect } from 'react';
import { useUsuario } from '../../context/UsuarioContext';
import { UsuarioServices } from '../../services/usuario.services';
import { supabase } from '../../data/supabase.config';
import Sidebar from "../../componentes/SideBar";
import Navbar from "../../componentes/NavBar";
import Footer from "../../componentes/footer";
import '../../assets/estilosPerfil/perfil.css';
import { useIdioma } from '../../context/IdiomasContext';

export const Perfil: React.FC = () => {
  const { usuario } = useUsuario();

  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error' | null>(null);
  const { translate } = useIdioma();

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
      setMensaje(translate('profile.messages.userUnavailable'));
      setMensajeTipo('error');
      return;
    }
    if (!nombre.trim()) {
      setMensaje(translate('profile.messages.nameRequired'));
      setMensajeTipo('error');
      return;
    }
    if (contrasena && contrasena.length < 6) {
      setMensaje(translate('profile.messages.passwordLength'));
      setMensajeTipo('error');
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

      setMensaje(translate('profile.messages.success'));
      setMensajeTipo('success');
      setContrasena('');
    } catch (err: any) {
      console.error('Error al guardar cambios:', err);
      setMensaje(err?.message ?? translate('profile.messages.error'));
      setMensajeTipo('error');
    } finally {
      setLoading(false);
    }
  };

  const getMensajeClass = () => {
    if (mensajeTipo === 'error') return 'text-red';
    if (mensajeTipo === 'success') return 'text-green';
    return '';
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <Navbar onSearch={() => {}} />

        <main className="perfil-container">
          <div className="perfil-header">
            <h1>{translate('profile.title')}</h1>
            <p>{translate('profile.subtitle')}</p>
          </div>

          {usuario ? (
            <>
              <div className="perfil-info">
                <h2>{translate('profile.info')}</h2>
                <div className="info-grid">
                  <div>
                    <strong>{translate('profile.name')}:</strong>
                    <p>{usuario.nombre}</p>
                  </div>
                  <div>
                    <strong>{translate('profile.email')}:</strong>
                    <p>{usuario.correo}</p>
                  </div>
                </div>
              </div>

              <div className="editar-perfil">
                <h2>{translate('profile.edit')}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre">{translate('profile.name')}</label>
                    <input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo">{translate('profile.email')}</label>
                    <input
                      id="correo"
                      type="email"
                      value={correo}
                      disabled // 🔒 ya no editable
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contrasena">{translate('profile.password')}</label>
                    <input
                      id="contrasena"
                      type="password"
                      placeholder={translate('profile.passwordPlaceholder')}
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-guardar">
                    {loading ? translate('profile.loading') : translate('profile.save')}
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
              {translate('profile.loginPrompt')}
            </p>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Perfil;
