import { useLocation } from 'react-router-dom'
import type { IUsuario } from '../../entidades/Usuario'
import { Productos } from '../../data/MockProducto'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import Carrusel from '../../componentes/carrusel'
import BarraBusqueda from '../../componentes/BarraBusqueda';
import React, { useState } from 'react';

const imagenes = [
  '/img/imagen1.jpg',
  '/img/imagen2.jpg',
  '/img/imagen3.jpg'
];

const Home: React.FC = () => {
  const location = useLocation()
  const usuario = (location.state as { usuario: IUsuario })?.usuario
  const [productos, setProductos] = useState(Productos);

    // Función para filtrar productos por búsqueda
  const handleSearch = (query: string) => {
    const filtrados = Productos.filter(prod =>
      prod.nombre_producto.toLowerCase().includes(query.toLowerCase()) ||
      prod.descripcion_producto.toLowerCase().includes(query.toLowerCase())
    );
    setProductos(filtrados);
  };



  return (
    <div className="home-page">
      <Navbar usuario={usuario ?? { nombre: "Invitado", rol: "visitante" }} />

      {/* Contenido principal */}
      <div className="home-content">

        {/* Barra de búsqueda */}
        <BarraBusqueda onSearch={handleSearch} />

        {/* Banner */}
        <div className="home-banner">
          <h2>Bienvenido a la Feria, {usuario?.nombre}!</h2>
          {usuario?.fotoPerfil && <img src={usuario.fotoPerfil} alt="Avatar" />}
        </div>

        {/* Carrusel */}
        <div className="home-carrusel">
          <Carrusel images={imagenes} interval={4000} />
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
