
import React, { useState } from 'react';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import Sidebar from '../../componentes/SideBar';
import { useUsuario } from '../../context/UsuarioContext';
import type { IFeria } from '../../entidades/Feria';

const AdminFeria: React.FC = () => {
  const { usuario } = useUsuario();

  const [ferias, setFerias] = useState<IFeria[]>([]);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'Virtual' | 'Presencial' | 'Mixta'>('Virtual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reglas, setReglas] = useState('');
  const [error, setError] = useState('');

  if (!usuario?.esAdmin) {
    return (
      <div className="home-page" style={{ display: 'flex' }}>
        <Sidebar />
        <div className="home-main" style={{ flex: 1 }}>
          <Navbar onSearch={() => {}} />
          <div className="home-content">
            <div className="admin-card">
              <h2>Acceso denegado</h2>
              <p>No tienes permisos para ver esta página.</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const handleCrearFeria = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !tipo || !fechaInicio || !fechaFin || !reglas.trim()) {
      setError('Completa todos los campos');
      return;
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      setError('La fecha de fin debe ser igual o posterior a la fecha de inicio');
      return;
    }

    const nuevaFeria: IFeria = {
      id: ferias.length + 1,
      nombre: nombre.trim(),
      tipo,
      fechaInicio,
      fechaFin,
      reglas: reglas.trim()
    };

    setFerias(prev => [nuevaFeria, ...prev]);
    setNombre('');
    setTipo('Virtual');
    setFechaInicio('');
    setFechaFin('');
    setReglas('');
    setError('');
    alert('Feria creada con éxito 🎉');
  };

  return (
    <div className="home-page" style={{ display: 'flex' }}>
      <Sidebar />

      <div className="home-main" style={{ flex: 1 }}>
        <Navbar onSearch={() => {}} />

        <div className="home-content">
          <div className="admin-card">
            <h2>Panel de Administrador: Crear Feria</h2>

            {error && <p className="error" role="alert">{error}</p>}

            <form onSubmit={handleCrearFeria} aria-label="form-crear-feria">
              <label htmlFor="nombre" style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#333' }}>
                Nombre de la feria
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Feria de Emprendimiento Octubre 2025"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />

              <label htmlFor="tipo" style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#333' }}>
                Tipo de feria
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={e => setTipo(e.target.value as 'Virtual' | 'Presencial' | 'Mixta')}
              >
                <option value="Virtual">Virtual</option>
                <option value="Presencial">Presencial</option>
                <option value="Mixta">Mixta</option>
              </select>

              {/* FECHAS: ahora con labels claros y helper text */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
                <div>
                  <label htmlFor="fechaInicio" style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#333' }}>
                    Fecha de inicio
                  </label>
                  <input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                  />
                  <small style={{ display: 'block', marginTop: 6, color: '#666' }}>
                    Fecha en la que la feria comienza (primer día disponible para publicaciones).
                  </small>
                </div>

                <div>
                  <label htmlFor="fechaFin" style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#333' }}>
                    Fecha de fin
                  </label>
                  <input
                    id="fechaFin"
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                  />
                  <small style={{ display: 'block', marginTop: 6, color: '#666' }}>
                    Fecha en la que la feria termina (último día permitido para publicaciones).
                  </small>
                </div>
              </div>

              <label htmlFor="reglas" style={{ fontWeight: 600, marginTop: 12, marginBottom: 6, display: 'block', color: '#333' }}>
                Reglas de la feria
              </label>
              <textarea
                id="reglas"
                placeholder="Ej: Solo estudiantes activos pueden publicar. Prohibido vender bebidas alcohólicas."
                value={reglas}
                onChange={e => setReglas(e.target.value)}
                maxLength={1000}
              />

              <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>Crear Feria</button>
            </form>

            <div className="ferias-list" style={{ marginTop: 20 }}>
              {ferias.length === 0 ? (
                <p>No se han creado ferias todavía.</p>
              ) : (
                ferias.map(f => (
                  <div className="feria-item" key={f.id}>
                    <h4>{f.nombre}</h4>
                    <p><strong>Tipo:</strong> {f.tipo}</p>
                    <p><strong>Fechas:</strong> {f.fechaInicio} → {f.fechaFin}</p>
                    <p><strong>Reglas:</strong> {f.reglas}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AdminFeria;