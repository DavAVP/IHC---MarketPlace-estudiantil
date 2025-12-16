import React, { useState, useEffect } from 'react'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import Sidebar from '../../componentes/SideBar'
import { useUsuario } from '../../context/UsuarioContext'
import type { IFeria } from '../../entidades/Feria'
import type { ICategoria } from '../../entidades/Categoria'
import { FeriaService } from '../../services/feria.service'
import { CategoriaService } from '../../services/categoria.service'
import { useIdioma } from '../../context/IdiomasContext'

const AdminFeria: React.FC = () => {
  const { usuario } = useUsuario()
  const { translate } = useIdioma()

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
      <div className="home-page">
        <Sidebar />
        <div className="home-main">
          <Navbar onSearch={() => {}} />
          <div className="home-content">
            <div className="admin-card">
              <h2>{translate('admin.accessDenied.title')}</h2>
              <p>{translate('admin.accessDenied.message')}</p>
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
      setError(translate('admin.errors.fillAll'))
      return
    }
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      setError(translate('admin.errors.date'))
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
        alert(translate('admin.alerts.fairCreated'))
      }
    } catch (err) {
      console.error('Error al crear feria:', err)
      setError(translate('admin.errors.fairCreate'))
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Crear categoría
  const handleCrearCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreCategoria.trim() || !descripcionCategoria.trim()) {
      setError(translate('admin.errors.fillAllCategory'))
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
        alert(translate('admin.alerts.categoryCreated'))
      }
    } catch (err) {
      console.error('Error al crear categoría:', err)
      setError(translate('admin.errors.categoryCreate'))
    }
  }

  return (
    <div className="home-page">
      <Sidebar />
      <div className="home-main">
        <Navbar onSearch={() => {}} />

        {/* 🔹 Contenedor principal en grid: formularios izquierda, edición derecha */}
        <div className="home-content admin-content-grid">

          {/* 🔹 Columna izquierda: Formularios */}
          <div>
            <div className="admin-card">
              <h2>{translate('admin.fair.title')}</h2>
              {error && <p className="error" role="alert">{error}</p>}

              <form onSubmit={handleCrearFeria} aria-label="form-crear-feria">
                <label>{translate('admin.fair.name')}</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder={translate('admin.fair.placeholderName')} />
                {/* 🔹 Nombre de la feria */}

                <label>{translate('admin.fair.type')}</label>
                <select value={tipo} onChange={e => setTipo(e.target.value as 'Virtual' | 'Presencial' | 'Mixta')}>
                  <option value="Virtual">{translate('admin.fair.types.virtual')}</option>
                  <option value="Presencial">{translate('admin.fair.types.inPerson')}</option>
                  <option value="Mixta">{translate('admin.fair.types.mixed')}</option>
                </select>
                {/* 🔹 Selecciona tipo de feria */}

                <label>{translate('admin.fair.start')}</label>
                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                {/* 🔹 Fecha de inicio */}
                <label>{translate('admin.fair.end')}</label>
                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                {/* 🔹 Fecha de fin */}

                <label>{translate('admin.fair.rules')}</label>
                <textarea value={reglas} onChange={e => setReglas(e.target.value)} placeholder={translate('admin.fair.placeholderRules')} />
                {/* 🔹 Reglas de la feria */}

                <button type="submit" className="btn-primary">{loading ? translate('admin.fair.creating') : translate('admin.fair.create')}</button>
              </form>

              <h3>{translate('admin.category.title')}</h3>
              <form onSubmit={handleCrearCategoria}>
                <label>{translate('admin.category.name')}</label>
                <input type="text" value={nombreCategoria} onChange={e => setNombreCategoria(e.target.value)} required />
                {/* 🔹 Nombre de la categoría */}

                <label>{translate('admin.category.description')}</label>
                <textarea value={descripcionCategoria} onChange={e => setDescripcionCategoria(e.target.value)} required />
                {/* 🔹 Descripción de la categoría */}

                <label>{translate('admin.category.selectFair')}</label>
                <select value={categoriaFeriaSeleccionada} onChange={e => setCategoriaFeriaSeleccionada(e.target.value)}>
                  <option value="">{translate('admin.category.none')}</option>
                  {ferias.map(f => (
                    <option key={f.id_feria} value={f.id_feria}>{f.nombre_feria}</option>
                  ))}
                </select>
                {/* 🔹 Asociar categoría a una feria (opcional) */}

                <button type="submit" className="btn-primary">{translate('admin.category.create')}</button>
              </form>
            </div>
          </div>

          {/* 🔹 Columna derecha: Edición de ferias y categorías */}
          <div>
            <div className="admin-card">
              <h2>{translate('admin.edit.fairs')}</h2>
              {ferias.map(feria => (
                <div key={feria.id_feria} className="edit-item">
                  <span>{feria.nombre_feria}</span>
                  <button className="btn-secondary" onClick={() => {/* abrir modal/editar */}}>{translate('admin.buttons.edit')}</button>
                  <button className="btn-danger" onClick={async () => {
                    const confirmed = window.confirm(translate('admin.confirm.deleteFair'))
                    if (!confirmed) return
                    const success = await FeriaService.EliminarFeria(feria.id_feria!)
                    if (success) setFerias(prev => prev.filter(f => f.id_feria !== feria.id_feria))
                  }}>{translate('admin.buttons.delete')}</button>
                </div>
              ))}

              <h2>{translate('admin.edit.categories')}</h2>
              {categorias.map(cat => (
                <div key={cat.id_categoria} className="edit-item">
                  <span>{cat.nombre_categoria}</span>
                  <button className="btn-secondary" onClick={() => {/* abrir modal/editar */}}>{translate('admin.buttons.edit')}</button>
                  <button className="btn-danger" onClick={async () => {
                    const confirmed = window.confirm(translate('admin.confirm.deleteCategory'))
                    if (!confirmed) return
                    const success = await CategoriaService.EliminarCategoria(cat.id_categoria!)
                    if (success) setCategorias(prev => prev.filter(c => c.id_categoria !== cat.id_categoria))
                  }}>{translate('admin.buttons.delete')}</button>
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
