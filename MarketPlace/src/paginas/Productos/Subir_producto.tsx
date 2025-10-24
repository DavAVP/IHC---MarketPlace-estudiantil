// src/pages/SubirProductos.tsx
import React, { useState } from 'react'
import Sidebar from '../../componentes/SideBar'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import { useUsuario } from '../../context/UsuarioContext'
import { Productos } from '../../data/MockProducto'
import type { IProducto } from '../../entidades/producto'

const SubirProductos: React.FC = () => {
  const { usuario } = useUsuario()
  const [productos, setProductos] = useState<IProducto[]>(Productos)
  const [formData, setFormData] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    precio: '',
    ubicacion_producto: '',
    foto_producto: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Crear nuevo producto de prueba escalable para DB
    const nuevoProducto: IProducto = {
      id_producto: productos.length + 1,
      Usuario_id: usuario ? Number(usuario.id) : 0, // relación con usuario logueado
      categoria_id: 0, // categoría por defecto
      nombre_producto: formData.nombre_producto,
      descripcion_producto: formData.descripcion_producto,
      precio: Number(formData.precio),
      ubicacion_producto: formData.ubicacion_producto,
      foto_producto: formData.foto_producto || '/img/default-product.jpg',
      fecha_Publicacion: new Date().toISOString(),
    }

    setProductos(prev => [...prev, nuevoProducto])

    // Limpiar formulario
    setFormData({
      nombre_producto: '',
      descripcion_producto: '',
      precio: '',
      ubicacion_producto: '',
      foto_producto: '',
    })
  }

  return (
    <div className="home-page flex">
      <Sidebar />
      <div className="home-main flex-1">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-4">
          <div className="home-banner bg-blue-100 rounded-xl p-6 flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-blue-800">
                Subir Productos, {usuario?.nombre || 'Invitado'}!
              </h2>
              <p className="text-gray-700 mt-2">
                Agrega tus productos para que los estudiantes puedan descubrirlos.
              </p>
            </div>
            <img
              src={usuario?.fotoPerfil || '/img/default-avatar.jpg'}
              alt="Avatar"
              className="user-avatar w-16 h-16 rounded-full shadow-md object-cover"
            />
          </div>

          {/* Formulario para subir producto */}
          <form
            className="bg-white p-6 rounded-xl shadow-md mb-8"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-semibold mb-4">Nuevo Producto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre_producto"
                  value={formData.nombre_producto}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion_producto"
                  value={formData.descripcion_producto}
                  onChange={handleChange}
                  className="input-field w-full"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion_producto"
                  value={formData.ubicacion_producto}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  name="foto_producto"
                  value={formData.foto_producto}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="/img/default-product.jpg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 btn-primary px-6 py-2 rounded-md shadow-sm hover:shadow-md"
            >
              Subir Producto
            </button>
          </form>

          {/* Grid de productos */}
          <div className="productos-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map(prod => (
              <div
                key={prod.id_producto}
                className="producto-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4"
              >
                <img
                  src={prod.foto_producto}
                  alt={prod.nombre_producto}
                  className="producto-img w-full h-40 object-cover rounded-md mb-3"
                />
                <div className="producto-info">
                  <h3 className="font-semibold text-lg text-blue-700">{prod.nombre_producto}</h3>
                  <p className="text-gray-700 mt-1">{prod.descripcion_producto}</p>
                  <p className="mt-2 text-sm text-gray-600"><b>Precio:</b> ${prod.precio}</p>
                  <p className="text-sm text-gray-600"><b>Ubicación:</b> {prod.ubicacion_producto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default SubirProductos
