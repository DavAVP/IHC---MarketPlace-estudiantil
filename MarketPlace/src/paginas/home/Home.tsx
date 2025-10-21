import { useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import Sidebar from '../../componentes/SideBar'
import Carrusel from '../../componentes/carrusel'
import { Productos } from '../../data/MockProducto'
import type { IFeria } from '../../entidades/Feria'
import type { IUsuario } from '../../entidades/IUsuario'

const Home: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const usuario = (location.state as { usuario?: IUsuario })?.usuario ?? null

  // Productos
  const allProductos = Productos
  const [productos, setProductos] = useState(allProductos)

  // Ferias
  const ferias: IFeria[] = [
    {
      id: 1,
      nombre: 'Feria de Emprendimiento 2025',
      tipo: 'Mixta',
      fechaInicio: '2025-10-25',
      fechaFin: '2025-10-30',
      reglas: 'Solo estudiantes registrados pueden participar. Prohibida la venta de alcohol.'
    },
    {
      id: 2,
      nombre: 'Expo Innovación Digital',
      tipo: 'Virtual',
      fechaInicio: '2025-11-05',
      fechaFin: '2025-11-10',
      reglas: 'Se aceptan proyectos individuales o grupales de máximo 4 integrantes.'
    }
  ]

  // Filtrado de productos
  const handleSearch = (query: string) => {
    setProductos(
      allProductos.filter(
        (p) =>
          p.nombre_producto.toLowerCase().includes(query.toLowerCase()) ||
          p.descripcion_producto.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  // Carrusel: imágenes + ferias
  const imagenes = ['/img/imagen1.jpg', '/img/imagen2.jpg', '/img/imagen3.jpg']

  const slides = useMemo(() => {
    const imageSlides = imagenes.map((src, idx) => (
      <img key={`img-${idx}`} src={src} alt={`Slide ${idx + 1}`} />
    ))

    const feriaSlides = ferias.map((f) => (
      <div
        key={`feria-${f.id}`}
        className="feria-slide"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 20,
          boxSizing: 'border-box'
        }}
      >
        <div
          className="feria-card"
          style={{
            width: '100%',
            maxWidth: 800,
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
            background: 'linear-gradient(90deg,#ffffff 0%, #f7fbff 100%)',
            display: 'flex',
            gap: 20,
            alignItems: 'center'
          }}
        >
          <div style={{ flex: '0 0 220px' }}>
            <div
              style={{
                width: '220px',
                height: '140px',
                borderRadius: 10,
                background: 'linear-gradient(135deg,#e6f2ff,#fff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0077cc',
                fontWeight: 700,
                fontSize: 24
              }}
            >
              {f.nombre.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, color: '#0b63a8', fontSize: 22 }}>{f.nombre}</h3>
            <p style={{ margin: '6px 0', color: '#555' }}>
              <b>Tipo:</b> {f.tipo}
            </p>
            <p style={{ margin: '6px 0', color: '#555' }}>
              📅 {f.fechaInicio} → {f.fechaFin}
            </p>
            <p style={{ margin: '8px 0 0', color: '#333' }}>{f.reglas}</p>
          </div>
        </div>
      </div>
    ))

    return [...imageSlides, ...feriaSlides]
  }, [imagenes, ferias])

  return (
    <div className="home-page" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="home-main" style={{ flex: 1 }}>
        <Navbar onSearch={handleSearch} />

        <div className="home-content" style={{ padding: 20 }}>
          {/* Banner de bienvenida */}
          <div className="home-banner" style={{ marginBottom: 18 }}>
            <h2>Bienvenido a la Feria, {usuario?.nombre || 'Invitado'}!</h2>
            <p style={{ color: '#555' }}>
              Descubre proyectos, conecta con estudiantes y participa en ferias activas.
            </p>
          </div>

          {/* Carrusel */}
          <div style={{ marginBottom: 30 }}>
            <Carrusel slides={slides} interval={4500} />
          </div>

          {/* Acciones */}
          <div className="home-actions" style={{ margin: '30px 0' }}>
            {!usuario?.esAdmin && (
              <button className="btn-primary"
                style={{ marginRight: 10 }}
                onClick={() => navigate('/subir-productos')}> Subir Producto </button>
            )}

            <button className="btn-secondary" onClick={() => console.log('Explorar Productos')}>
              Explorar Productos
            </button>
          </div>

          {/* Grid de productos */}
          <div className="productos-grid">
            {productos.map((prod) => (
              <div key={prod.id_producto} className="producto-card">
                <img
                  src={prod.foto_producto || '/img/default-product.jpg'}
                  alt={prod.nombre_producto}
                  className="producto-img"
                />
                <div className="producto-info">
                  <h3>{prod.nombre_producto}</h3>
                  <p>{prod.descripcion_producto}</p>
                  <p><b>Precio:</b> ${prod.precio}</p>
                  <p><b>Ubicación:</b> {prod.ubicacion_producto}</p>
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

export default Home
