import React, { useState } from 'react';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import Sidebar from '../../componentes/SideBar';
import Carrusel from '../../componentes/carrusel';
import { Productos } from '../../data/MockProducto';
import { useUsuario } from '../../context/UsuarioContext';

const imagenes = ['/img/imagen1.jpg','/img/imagen2.jpg','/img/imagen3.jpg'];

const Home: React.FC = () => {
  const { usuario } = useUsuario();
  const [productos, setProductos] = useState(Productos);

  const handleSearch = (query: string) => {
    setProductos(Productos.filter(p => 
      p.nombre_producto.toLowerCase().includes(query.toLowerCase()) || 
      p.descripcion_producto.toLowerCase().includes(query.toLowerCase())
    ));
  };

  return (
    <div className="home-page" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="home-main" style={{ flex: 1 }}>
        <Navbar onSearch={handleSearch} />

        <div className="home-content">
          <div className="home-banner">
            <h2>Bienvenido a la Feria, {usuario?.nombre || 'Invitado'}!</h2>
            {usuario?.fotoPerfil && <img src={usuario.fotoPerfil} alt="Avatar" className="user-avatar" />}
          </div>

          <Carrusel images={imagenes} interval={4000} />

          <div className="home-actions">
            {!usuario?.esAdmin && <button className="btn-primary">Subir Producto</button>}
            <button className="btn-secondary">Explorar Productos</button>
          </div>

          <div className="productos-grid">
            {productos.map(prod => (
              <div key={prod.id_producto} className="producto-card">
                <img src={prod.foto_producto || '/img/default-product.jpg'} alt={prod.nombre_producto} className="producto-img" />
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
  );
};

export default Home;
