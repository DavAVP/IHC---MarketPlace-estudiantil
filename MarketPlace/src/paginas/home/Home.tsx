import { useLocation } from 'react-router-dom'
import type { IUsuario } from '../../entidades/Usuario'
import { Productos } from '../../data/MockProducto'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'

const Home: React.FC = () => {
  const location = useLocation()
  const usuario = (location.state as { usuario: IUsuario })?.usuario

  return (
    <div className="home-page">
      <Navbar usuario={usuario!} />

      {/* Contenido principal */}
      <div className="home-content">
        {/* Banner */}
        <div className="home-banner">
          <h1>Bienvenido a la Feria, {usuario?.nombre}!</h1>
          {usuario?.fotoPerfil && <img src={usuario.fotoPerfil} alt="Avatar" />}
        </div>

        {/* Acciones por rol */}
        <div className="home-actions">
          {usuario?.rol === 'estudiante' && <button>Subir Producto</button>}
          {usuario?.rol === 'comprador' && <button>Explorar Productos</button>}
        </div>

        {/* Lista de productos */}
        <div className="productos-grid">
          {Productos.map(prod => (
            <div key={prod.id_producto} className="producto-card">
              <h3>{prod.nombre_producto}</h3>
              <p>{prod.descripcion_producto}</p>
              <p><b>Precio:</b> ${prod.precio}</p>
              <p><b>Ubicación:</b> {prod.ubicacion_producto}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
