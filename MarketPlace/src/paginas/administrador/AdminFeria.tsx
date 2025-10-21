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
  const [tipo, setTipo] = useState('Virtual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reglas, setReglas] = useState('');
  const [error, setError] = useState('');

  if (!usuario?.esAdmin) return <div>No tienes permisos para ver esta página</div>;

  const handleCrearFeria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !tipo || !fechaInicio || !fechaFin || !reglas) {
      setError('Completa todos los campos');
      return;
    }

    const nuevaFeria: IFeria = {
      id: ferias.length + 1,
      nombre,
      tipo,
      fechaInicio,
      fechaFin,
      reglas
    };

    setFerias([...ferias, nuevaFeria]);
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
          <h2>Panel de Administrador: Crear Feria</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleCrearFeria}>
            <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="Virtual">Virtual</option>
              <option value="Presencial">Presencial</option>
              <option value="Mixta">Mixta</option>
            </select>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
            <textarea placeholder="Reglas" value={reglas} onChange={e => setReglas(e.target.value)} />
            <button type="submit">Crear Feria</button>
          </form>

          <div>
            <h3>Ferias Creadas</h3>
            {ferias.length === 0 ? (
              <p>No se han creado ferias todavía</p>
            ) : (
              ferias.map(f => (
                <div key={f.id}>
                  <p><b>Nombre:</b> {f.nombre}</p>
                  <p><b>Tipo:</b> {f.tipo}</p>
                  <p><b>Fechas:</b> {f.fechaInicio} - {f.fechaFin}</p>
                  <p><b>Reglas:</b> {f.reglas}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminFeria;
