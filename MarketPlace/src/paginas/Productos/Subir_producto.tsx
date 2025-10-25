import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IProducto } from '../../entidades/producto'
import { productoServices } from '../../services/producto.services'
import '../../assets/estilosProductos/productos.css'

export default function SubirProducto() {
  const navigate = useNavigate()

  const [producto, setProducto] = useState<Omit<IProducto, 'id_producto' | 'Usuario_id'>>({
    categoria_id: '',
    nombre_producto: '',
    precio: 0,
    descripcion_producto: '',
    ubicacion_producto: '',
    fecha_Publicacion: new Date().toISOString(),
  })


  
  const [mensaje, setMensaje] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProducto(prev => ({ ...prev, [name]: name === 'precio' ? parseFloat(value) || 0 : value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('Subiendo producto...')

    try {
      await productoServices.crearProducto(producto)
      setMensaje('Producto subido correctamente')
      setTimeout(() => navigate('/home'), 1500)
    } catch (error) {
      console.error('Error al subir producto:', error)
      setMensaje('Error al subir producto, inténtalo nuevamente')
    }
  }

  return (
    <div className="subir-container">
      <h2>Subir nuevo producto</h2>
      <form onSubmit={handleSubmit} className="subir-form">
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
        ></textarea>
        <input
          type="text"
          name="ubicacion_producto"
          placeholder="Ubicación del producto"
          value={producto.ubicacion_producto}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="btn-subir">Subir producto</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  )
}
