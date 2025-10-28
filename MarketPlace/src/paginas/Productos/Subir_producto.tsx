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
import '../../assets/estilosProductos/productos.css'

const SubirProducto: React.FC = () => {
  const navigate = useNavigate()
  const [imagen, setImagen] = useState<File | null>(null);

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
  const [ferias, setFerias] = useState<IFeria[]>([])

  // Cargar categorías y ferias
  useEffect(() => {
    const cargarDatos = async () => {
      const cats = await CategoriaService.ObtenerCategoria()
      setCategorias(cats ?? [])
      const fer = await FeriaService.ObtenerFerias()
      setFerias(fer ?? [])
    }
    cargarDatos()
  }, [])

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
    setMensaje('Subiendo producto...')

    try {
      await productoServices.crearProducto(producto, imagen || undefined)
      setMensaje('Producto subido correctamente')
      setTimeout(() => navigate('/home'), 1500)
    } catch (error) {
      console.error('Error al subir producto:', error)
      setMensaje('Error al subir producto, inténtalo nuevamente')
    }
  }

  return (
    <div className="flex home-page">
      <Sidebar />
      <div className="home-main">
        <Navbar onSearch={() => {}} />

        <div className="subir-container">
          <h2 className="text-2xl font-semibold mb-4">Subir nuevo producto</h2>
          <form onSubmit={handleSubmit} className="subir-form flex flex-col gap-4">
            <input
              type="text"
              name="nombre_producto"
              placeholder="Nombre del producto"
              value={producto.nombre_producto}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={producto.precio}
              onChange={handleChange}
              required
            />

            <textarea
              name="descripcion_producto"
              placeholder="Descripción"
              value={producto.descripcion_producto}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="ubicacion_producto"
              placeholder="Ubicación del producto"
              value={producto.ubicacion_producto}
              onChange={handleChange}
              required
            />

            {/* Select de categoría */}
            <label>Categoría</label>
            <select
              name="categoria_id"
              value={producto.categoria_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
              ))}
            </select>

            {/* Select de feria */}
            <label>Feria (opcional)</label>
            <select
              name="feria_id"
              value={producto.feria_id || ''}
              onChange={handleChange}
            >
              <option value="">Sin feria</option>
              {ferias.map(f => (
                <option key={f.id_feria} value={f.id_feria}>{f.nombre_feria}</option>
              ))}
            </select>

            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit" className="btn-subir">Subir producto</button>
          </form>
          {mensaje && <p className="mensaje mt-4">{mensaje}</p>}
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default SubirProducto
