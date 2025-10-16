import { useLocation } from 'react-router-dom';
import type { IUsuario } from '../../entidades/Usuario';
import { Productos } from '../../data/MockProducto';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import Carrusel from '../../componentes/carrusel';
import Sidebar from '../../componentes/SideBar';
import React, { useState } from 'react';

const imagenes = [
  '/img/imagen1.jpg',
  '/img/imagen2.jpg',
  '/img/imagen3.jpg'
];

const Home: React.FC = () => {
  const location = useLocation();
  const usuario = (location.state as { usuario: IUsuario })?.usuario;
  const [productos, setProductos] = useState(Productos);

  // Filtrado de productos
  const handleSearch = (query: string) => {
    const filtrados = Productos.filter(prod =>
      prod.nombre_producto.toLowerCase().includes(query.toLowerCase()) ||
      prod.descripcion_producto.toLowerCase().includes(query.toLowerCase())
    );
    setProductos(filtrados);
  };

  return (
    <div className="home-page" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="home-main" style={{ flex: 1 }}>
        {/* Navbar con barra de búsqueda integrada */}
        <Navbar
          usuario={usuario ?? { nombre: 'Invitado', rol: 'visitante' }}
          onSearch={handleSearch}
        />

        {/* Contenido */}
        <div className="home-content">
          {/* Banner */}
          <div className="home-banner">
            <h2>Bienvenido a la Feria, {usuario?.nombre}!</h2>
            {usuario?.fotoPerfil && <img src={usuario.fotoPerfil} alt="Avatar" />}
          </div>

          {/* Carrusel */}
          <div className="home-carrusel">
            <Carrusel images={imagenes} interval={4000} />
          </div>

          {/* Acciones */}
          <div className="home-actions">
            {usuario?.rol === 'estudiante' && <button>Subir Producto</button>}
            {usuario?.rol === 'comprador' && <button>Explorar Productos</button>}
          </div>

          {/* Grid de productos */}
          <div className="productos-grid">
            {productos.map(prod => (
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
    </div>
  );
};

export default Home;
