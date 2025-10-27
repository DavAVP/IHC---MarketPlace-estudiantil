// src/pages/Catalogo.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import Categorias from '../../componentes/categorias';
import { productoServices } from '../../services/producto.services';
import type { IProducto } from '../../entidades/producto';
import '../../assets/estiloshome/catalogo.css';

const Catalogo: React.FC = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<IProducto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    const cargarProductos = async () => {
      const data = await productoServices.ObtenerProductos();
      setProductos(data);
      setProductosFiltrados(data);
    };
    cargarProductos();
  }, []);

  const filtrarPorCategoria = (categoriaId: string | null) => {
    setCategoriaSeleccionada(categoriaId);
    if (!categoriaId) {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(p => p.categoria_id === categoriaId);
      setProductosFiltrados(filtrados);
    }
  };

  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-6 flex-1">
          <div className="home-banner mb-6">
            <h2>Catálogo de Productos</h2>
            <p>Aquí puedes explorar todos los productos disponibles en StudentsPlace.</p>
          </div>

          <div className="card-section mb-6">
            <h3>Categorías</h3>
            <Categorias
              onSelectCategoria={filtrarPorCategoria}
              categoriaSeleccionada={categoriaSeleccionada}
            />
          </div>

          <div className="card-section">
            <h3>Productos</h3>
            {productosFiltrados.length === 0 ? (
              <p>No hay productos disponibles en esta categoría.</p>
            ) : (
              <div className="productos-grid">
                {productosFiltrados.map((p) => (
                  <div key={p.id_producto} className="producto-card">
                    <img src={p.foto_producto || '/placeholder.png'} alt={p.nombre_producto} />
                    <h4>{p.nombre_producto}</h4>
                    <p>{p.descripcion_producto}</p>
                    <span className="precio">${p.precio}</span>
                    <button
                      className="btn-ver-producto"
                      onClick={() => navigate(`/ver-producto/${p.id_producto}`)}
                    >
                      🔍 Ver Producto
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Catalogo;
