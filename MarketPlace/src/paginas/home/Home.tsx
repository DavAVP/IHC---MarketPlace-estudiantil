import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../componentes/SideBar'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import Carrusel from '../../componentes/carrusel'
import { FeriaService } from '../../services/feria.service'
import { productoServices } from '../../services/producto.services'
import { useUsuario } from '../../context/UsuarioContext'
import type { IFeria } from '../../entidades/Feria'
import type { IProducto } from '../../entidades/producto'

const Home: React.FC = () => {
  const { usuario } = useUsuario()
  const navigate = useNavigate()
  const [ferias, setFerias] = useState<IFeria[]>([])
  const [productos, setProductos] = useState<IProducto[]>([])
  const [loading, setLoading] = useState(true)

  // 📦 Cargar ferias y productos desde Supabase
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const feriasData = await FeriaService.ObtenerFerias()
        const productosData = await productoServices.ObtenerProductos()

        setFerias(feriasData || [])
        setProductos(productosData || [])
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  // 🎠 Slides del carrusel (solo ferias activas)
  const slides = useMemo(() => {
    return ferias.map((f) => (
      <div
        key={f.id_feria}
        className="feria-slide flex items-center justify-center h-full p-6 fade-slide"
      >
        <div className="feria-card bg-white rounded-xl p-6 shadow-md max-w-3xl flex gap-6 items-center transition-transform duration-500 hover:scale-[1.02]">
          <div className="bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center w-32 h-32 rounded-lg">
            {f.nombre_feria.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-blue-800">{f.nombre_feria}</h3>
            <p className="text-gray-600">
              <b>Tipo:</b> {f.tipo}
            </p>
            <p className="text-gray-600">
              📅 {f.fechaInicio} → {f.fechaFin}
            </p>
            <p className="text-gray-700 mt-2">{f.reglas}</p>
          </div>
        </div>
      </div>
    ))
  }, [ferias])

  // 🏆 Productos destacados (máximo 6)
  const productosDestacados = productos.slice(0, 6)

  return (
    <div className="home-page flex">
      <Sidebar />
      <div className="home-main flex-1">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-4">
          {/* Banner de bienvenida */}
          <div className="home-banner bg-blue-100 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-800">
              Bienvenido a la Feria, {usuario?.nombre || 'Invitado'}!
            </h2>
            <p className="text-gray-700 mt-2">
              Explora los productos más destacados, conoce las ferias activas y forma parte de nuestra comunidad.
            </p>
          </div>

          {/* Carrusel dinámico solo con ferias */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">🎪 Ferias Activas</h2>
            {ferias.length > 0 ? (
              <Carrusel slides={slides} interval={5000} />
            ) : (
              <p className="text-gray-600 text-center">No hay ferias activas por el momento.</p>
            )}
          </div>

          {/* Productos destacados */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Productos destacados</h2>
            {loading ? (
              <p className="text-gray-600">Cargando productos...</p>
            ) : productosDestacados.length === 0 ? (
              <p className="text-gray-600">No hay productos disponibles.</p>
            ) : (
              <div className="productos-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {productosDestacados.map((prod) => (
                  <div
                    key={prod.id_producto}
                    className="producto-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4"
                  >
                    <img
                      src={prod.foto_producto || '/img/default-product.jpg'}
                      alt={prod.nombre_producto}
                      className="producto-img w-full h-40 object-cover rounded-md mb-3"
                    />
                    <div className="producto-info">
                      <h3 className="font-semibold text-lg text-blue-700">
                        {prod.nombre_producto}
                      </h3>
                      <p className="text-gray-700 mt-1">
                        {prod.descripcion_producto}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        <b>Precio:</b> ${prod.precio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default Home
