import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IProducto } from '../../entidades/producto'
import { productoServices } from '../../services/producto.services'
import { CategoriaService } from '../../services/categoria.service'
import { FeriaService } from '../../services/feria.service'
import type { ICategoria } from '../../entidades/Categoria'
import type { IFeria } from '../../entidades/Feria'
import Sidebar from '../../componentes/SideBar'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import { useIdioma } from '../../context/IdiomasContext'
import { useUsuario } from '../../context/UsuarioContext'
import { ParticipacionService } from '../../services/participacion.service'
import '../../assets/estilosProductos/productos.css'

const SubirProducto: React.FC = () => {
  const navigate = useNavigate()
  const [imagen, setImagen] = useState<File | null>(null);
  const { translate } = useIdioma()
  const { usuario, cargando: cargandoUsuario } = useUsuario()

  const [producto, setProducto] = useState<Omit<IProducto, 'id_producto' | 'Usuario_id'>>({
    categoria_id: '',
    feria_id: '',
    nombre_producto: '',
    foto_producto: null,
    precio: 0,
    descripcion_producto: '',
    ubicacion_producto: '',
    fecha_Publicacion: new Date().toISOString(),
  })

  const [mensaje, setMensaje] = useState<string>('')
  const [categorias, setCategorias] = useState<ICategoria[]>([])
  const [feriasDisponibles, setFeriasDisponibles] = useState<IFeria[]>([])
  const [participacionesCargadas, setParticipacionesCargadas] = useState(false)

  // Cargar categorías disponibles
  useEffect(() => {
    const cargarDatos = async () => {
      const cats = await CategoriaService.ObtenerCategoria()
      setCategorias(cats ?? [])
    }
    cargarDatos()
  }, [])

  // Cargar ferias solo si el usuario participa en alguna
  useEffect(() => {
    if (cargandoUsuario) return

    let activo = true
    const cargarFeriasDisponibles = async () => {
      if (!usuario?.id) {
        if (activo) {
          setFeriasDisponibles([])
          setProducto(prev => ({ ...prev, feria_id: '' }))
          setParticipacionesCargadas(true)
        }
        return
      }

      if (activo) setParticipacionesCargadas(false)

      try {
        const [participaciones, feriasRegistradas] = await Promise.all([
          ParticipacionService.obtenerParticipacionesPorUsuario(usuario.id),
          FeriaService.ObtenerFerias()
        ])

        if (!activo) return

        const feriasAutorizadas = feriasRegistradas.filter((feria) =>
          participaciones.some((participacion) => participacion.feriaID === feria.id_feria)
        )

        setFeriasDisponibles(feriasAutorizadas)

        if (feriasAutorizadas.length === 0) {
          setProducto(prev => ({ ...prev, feria_id: '' }))
        }
      } catch (error) {
        console.error('Error al cargar ferias disponibles:', error)
        if (activo) {
          setFeriasDisponibles([])
          setProducto(prev => ({ ...prev, feria_id: '' }))
        }
      } finally {
        if (activo) setParticipacionesCargadas(true)
      }
    }

    cargarFeriasDisponibles()

    return () => {
      activo = false
    }
  }, [usuario?.id, cargandoUsuario])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProducto(prev => ({ ...prev, [name]: name === 'precio' ? parseFloat(value) || 0 : value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Imagen seleccionada:", file);
      setImagen(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje(translate('messages.uploading'))

    try {
      await productoServices.crearProducto(producto, imagen || undefined)
      setMensaje(translate('messages.uploadSuccess'))
      setTimeout(() => navigate('/home'), 1500)
    } catch (error) {
      console.error('Error al subir producto:', error)
        setMensaje(translate('messages.uploadError'))
    }
  }

  return (
    <div className="flex home-page">
      <Sidebar />
      <div className="home-main">
        <Navbar onSearch={() => {}} />

        <div className="subir-container">
          <h2 className="text-2xl font-semibold mb-4">{translate('upload.title')}</h2>
          <form onSubmit={handleSubmit} className="subir-form flex flex-col gap-4">
            <input
              type="text"
              name="nombre_producto"
              placeholder={translate('upload.name')}
              value={producto.nombre_producto}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="precio"
              placeholder={translate('upload.price')}
              value={producto.precio}
              onChange={handleChange}
              required
            />

            <textarea
              name="descripcion_producto"
              placeholder={translate('upload.description')}
              value={producto.descripcion_producto}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="ubicacion_producto"
              placeholder={translate('upload.location')}
              value={producto.ubicacion_producto}
              onChange={handleChange}
              required
            />

            {/* Select de categoría */}
            <label>{translate('upload.category')}</label>
            <select
              name="categoria_id"
              value={producto.categoria_id}
              onChange={handleChange}
              required
            >
              <option value="">{translate('upload.categoryPlaceholder')}</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
              ))}
            </select>

            {/* Select de feria disponible solo si el usuario participa */}
            {participacionesCargadas && feriasDisponibles.length > 0 && (
              <>
                <label>{translate('upload.fair')}</label>
                <select
                  name="feria_id"
                  value={producto.feria_id || ''}
                  onChange={handleChange}
                >
                  <option value="">{translate('upload.fairPlaceholder')}</option>
                  {feriasDisponibles.map(f => (
                    <option key={f.id_feria} value={f.id_feria}>{f.nombre_feria}</option>
                  ))}
                </select>
              </>
            )}

            {participacionesCargadas && feriasDisponibles.length === 0 && (
              <p>{translate('upload.fairNote')}</p>
            )}

            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit" className="btn-subir">{translate('upload.submit')}</button>
          </form>
          {mensaje && <p className="mensaje mt-4">{mensaje}</p>}
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default SubirProducto
