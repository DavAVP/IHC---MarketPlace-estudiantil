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

  // 🔹 Estados para ferias
  const [ferias, setFerias] = useState<IFeria[]>([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<'Virtual' | 'Presencial' | 'Mixta'>('Virtual')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [reglas, setReglas] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔹 Estados para categorías
  const [categorias, setCategorias] = useState<ICategoria[]>([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [descripcionCategoria, setDescripcionCategoria] = useState('')
  const [categoriaFeriaSeleccionada, setCategoriaFeriaSeleccionada] = useState<string>('')

  const [error, setError] = useState('')

  // 🔹 Control de acceso: solo admins
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

  // 🔹 Cargar ferias y categorías al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const dataFerias = await FeriaService.ObtenerFerias()
      if (dataFerias) setFerias(dataFerias)

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
    if (!nombreCategoria.trim() || !descripcionCategoria.trim()) {
      setError('Completa todos los campos de la categoría')
      return
    }

    try {
      const nuevaCategoria = {
        nombre_categoria: nombreCategoria.trim(),
        descripcion_categoria: descripcionCategoria.trim(),
        ...(categoriaFeriaSeleccionada && { feria_id: categoriaFeriaSeleccionada })
      }

      const categoriaCreada = await CategoriaService.CrearCategoria(nuevaCategoria)
      if (categoriaCreada) {
        setCategorias(prev => [...prev, categoriaCreada])
        setNombreCategoria('')
        setDescripcionCategoria('')
        setCategoriaFeriaSeleccionada('')
        alert('Categoría creada exitosamente 🎉')
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

        {/* 🔹 Contenedor principal en grid: formularios izquierda, edición derecha */}
        <div className="home-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* 🔹 Columna izquierda: Formularios */}
          <div>
            <div className="admin-card">
              <h2>Crear Feria</h2>
              {error && <p className="error" role="alert">{error}</p>}

              <form onSubmit={handleCrearFeria} aria-label="form-crear-feria">
                <label>Nombre de la feria</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Feria Octubre 2025" />
                {/* 🔹 Nombre de la feria */}

                <label>Tipo de feria</label>
                <select value={tipo} onChange={e => setTipo(e.target.value as 'Virtual' | 'Presencial' | 'Mixta')}>
                  <option value="Virtual">Virtual</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Mixta">Mixta</option>
                </select>
                {/* 🔹 Selecciona tipo de feria */}

                <label>Fecha de inicio</label>
                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                {/* 🔹 Fecha de inicio */}
                <label>Fecha de fin</label>
                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                {/* 🔹 Fecha de fin */}

                <label>Reglas de la feria</label>
                <textarea value={reglas} onChange={e => setReglas(e.target.value)} placeholder="Ej: Solo estudiantes activos pueden publicar." />
                {/* 🔹 Reglas de la feria */}

                <button type="submit" className="btn-primary">{loading ? 'Creando...' : 'Crear Feria'}</button>
              </form>

              <h3>Crear Categoría</h3>
              <form onSubmit={handleCrearCategoria}>
                <label>Nombre de la categoría</label>
                <input type="text" value={nombreCategoria} onChange={e => setNombreCategoria(e.target.value)} required />
                {/* 🔹 Nombre de la categoría */}

                <label>Descripción de la categoría</label>
                <textarea value={descripcionCategoria} onChange={e => setDescripcionCategoria(e.target.value)} required />
                {/* 🔹 Descripción de la categoría */}

                <label>Selecciona la feria (opcional)</label>
                <select value={categoriaFeriaSeleccionada} onChange={e => setCategoriaFeriaSeleccionada(e.target.value)}>
                  <option value="">-- Ninguna --</option>
                  {ferias.map(f => (
                    <option key={f.id_feria} value={f.id_feria}>{f.nombre_feria}</option>
                  ))}
                </select>
                {/* 🔹 Asociar categoría a una feria (opcional) */}

                <button type="submit" className="btn-primary">Crear Categoría</button>
              </form>
            </div>
          </div>

          {/* 🔹 Columna derecha: Edición de ferias y categorías */}
          <div>
            <div className="admin-card">
              <h2>Editar Ferias</h2>
              {ferias.map(feria => (
                <div key={feria.id_feria} className="edit-item">
                  <span>{feria.nombre_feria}</span>
                  <button className="btn-secondary" onClick={() => {/* abrir modal/editar */}}>Editar</button>
                  <button className="btn-danger" onClick={async () => {
                    const confirmed = window.confirm('¿Seguro que quieres eliminar esta feria?')
                    if (!confirmed) return
                    const success = await FeriaService.EliminarFeria(feria.id_feria!)
                    if (success) setFerias(prev => prev.filter(f => f.id_feria !== feria.id_feria))
                  }}>Eliminar</button>
                </div>
              ))}

              <h2>Editar Categorías</h2>
              {categorias.map(cat => (
                <div key={cat.id_categoria} className="edit-item">
                  <span>{cat.nombre_categoria}</span>
                  <button className="btn-secondary" onClick={() => {/* abrir modal/editar */}}>Editar</button>
                  <button className="btn-danger" onClick={async () => {
                    const confirmed = window.confirm('¿Seguro que quieres eliminar esta categoría?')
                    if (!confirmed) return
                    const success = await CategoriaService.EliminarCategoria(cat.id_categoria!)
                    if (success) setCategorias(prev => prev.filter(c => c.id_categoria !== cat.id_categoria))
                  }}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  )
}

export default AdminFeria
