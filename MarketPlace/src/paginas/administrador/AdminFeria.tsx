import React, { useState, useEffect } from 'react'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import Sidebar from '../../componentes/SideBar'
import { useUsuario } from '../../context/UsuarioContext'
import type { IFeria } from '../../entidades/Feria'
import { FeriaService } from '../../services/feria.service' // 👈 tu servicio

const AdminFeria: React.FC = () => {
  const { usuario } = useUsuario()

  const [ferias, setFerias] = useState<IFeria[]>([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<'Virtual' | 'Presencial' | 'Mixta'>('Virtual')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [reglas, setReglas] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔹 Control de acceso
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
    )
  }

  // 🔹 Cargar ferias desde el service
  useEffect(() => {
    const cargarFerias = async () => {
      const data = await FeriaService.ObtenerFerias()
      if (data) setFerias(data)
    }
    cargarFerias()
  }, [])

  // 🔹 Crear feria usando el service
  const handleCrearFeria = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim() || !tipo || !fechaInicio || !fechaFin || !reglas.trim()) {
      setError('Completa todos los campos')
      return
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      setError('La fecha de fin debe ser igual o posterior a la fecha de inicio')
      return
    }

    setLoading(true)
    setError('')

    try {
      const nuevaFeria: Omit<IFeria, 'id_feria'> = {
        nombre_feria: nombre.trim(),
        tipo,
        fechaInicio,
        fechaFin,
        reglas: reglas.trim(),
      }

      const feriaCreada = await FeriaService.CrearFeria(nuevaFeria)

      if (feriaCreada) {
        setFerias(prev => [feriaCreada, ...prev])
        setNombre('')
        setTipo('Virtual')
        setFechaInicio('')
        setFechaFin('')
        setReglas('')
        alert('Feria creada con éxito 🎉')
      }
    } catch (err) {
      console.error('Error al crear feria:', err)
      setError('No se pudo crear la feria')
    } finally {
      setLoading(false)
    }
  }

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
              <label>Nombre de la feria</label>
              <input
                type="text"
                placeholder="Ej: Feria de Emprendimiento Octubre 2025"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />

              <label>Tipo de feria</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as 'Virtual' | 'Presencial' | 'Mixta')}
              >
                <option value="Virtual">Virtual</option>
                <option value="Presencial">Presencial</option>
                <option value="Mixta">Mixta</option>
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Fecha de inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                  />
                </div>

                <div>
                  <label>Fecha de fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                  />
                </div>
              </div>

              <label>Reglas de la feria</label>
              <textarea
                placeholder="Ej: Solo estudiantes activos pueden publicar."
                value={reglas}
                onChange={e => setReglas(e.target.value)}
              />

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Feria'}
              </button>
            </form>

            <div className="ferias-list" style={{ marginTop: 20 }}>
              {ferias.length === 0 ? (
                <p>No se han creado ferias todavía.</p>
              ) : (
                ferias.map(f => (
                  <div className="feria-item" key={f.id_feria}>
                    <h4>{f.nombre_feria}</h4>
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
  )
}

export default AdminFeria
