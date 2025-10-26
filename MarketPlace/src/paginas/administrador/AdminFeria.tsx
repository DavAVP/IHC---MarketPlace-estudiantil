import React, { useState, useEffect } from 'react'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import Sidebar from '../../componentes/SideBar'
import { useUsuario } from '../../context/UsuarioContext'
import type { IFeria } from '../../entidades/Feria'
import type { ICategoria } from '../../entidades/Categoria'
import { FeriaService } from '../../services/feria.service'
import { CategoriaService } from '../../services/categoria.service'

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

  const [categorias, setCategorias] = useState<ICategoria[]>([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [descripcionCategoria, setDescripcionCategoria] = useState('')
  const [categoriaFeriaSeleccionada, setCategoriaFeriaSeleccionada] = useState<string>('')

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

  // 🔹 Cargar ferias y categorías
  useEffect(() => {
    const cargarDatos = async () => {
      const dataFerias = await FeriaService.ObtenerFerias()
      if (dataFerias) {
        setFerias(dataFerias)
        console.log("Ferias cargadas:", dataFerias)
      }
      const dataCategorias = await CategoriaService.ObtenerCategoria()
      if (dataCategorias) setCategorias(dataCategorias)
    }
    cargarDatos()
  }, [])

  // 🔹 Crear feria
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
      const nuevaFeria = {
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

  // 🔹 Crear categoría
  const handleCrearCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("UUID seleccionado:", categoriaFeriaSeleccionada)

    if (!nombreCategoria.trim() || !descripcionCategoria.trim() || !categoriaFeriaSeleccionada) {
      setError('Completa todos los campos de categoría y selecciona la feria')
      return
    }

    try {
      const nuevaCategoria = {
        nombre_categoria: nombreCategoria.trim(),
        descripcion_categoria: descripcionCategoria.trim(),
        feria_id: categoriaFeriaSeleccionada
      }

      const categoriaCreada = await CategoriaService.CrearCategoria(nuevaCategoria)
      if (categoriaCreada) {
        setCategorias(prev => [...prev, categoriaCreada])
        setNombreCategoria('')
        setDescripcionCategoria('')
        setCategoriaFeriaSeleccionada('')
        alert('Categoría creada y asociada a la feria 🎉')
      }
    } catch (err) {
      console.error('Error al crear categoría:', err)
      setError('No se pudo crear la categoría')
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
              <input type="text" placeholder="Ej: Feria Octubre 2025" value={nombre} onChange={e => setNombre(e.target.value)} />

              <label>Tipo de feria</label>
              <select value={tipo} onChange={e => setTipo(e.target.value as 'Virtual' | 'Presencial' | 'Mixta')}>
                <option value="Virtual">Virtual</option>
                <option value="Presencial">Presencial</option>
                <option value="Mixta">Mixta</option>
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Fecha de inicio</label>
                  <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </div>
                <div>
                  <label>Fecha de fin</label>
                  <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </div>
              </div>

              <label>Reglas de la feria</label>
              <textarea placeholder="Ej: Solo estudiantes activos pueden publicar." value={reglas} onChange={e => setReglas(e.target.value)} />

              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear Feria'}</button>
            </form>

            <h3 style={{ marginTop: 20 }}>Crear Categoría para Feria</h3>
            <form onSubmit={handleCrearCategoria}>
              <label>Nombre de la categoría</label>
              <input type="text" value={nombreCategoria} onChange={e => setNombreCategoria(e.target.value)} required />

              <label>Descripción de la categoría</label>
              <textarea value={descripcionCategoria} onChange={e => setDescripcionCategoria(e.target.value)} required />

              <label>Selecciona la feria</label>
              <select
                value={categoriaFeriaSeleccionada}
                onChange={e => setCategoriaFeriaSeleccionada(e.target.value)}
                required
              >
                <option value="">Selecciona una feria</option>
                {ferias.map((f, index) => (
                  <option key={f.id_feria ?? index} value={f.id_feria}>
                    {f.nombre_feria}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn-primary">Crear Categoría</button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default AdminFeria
