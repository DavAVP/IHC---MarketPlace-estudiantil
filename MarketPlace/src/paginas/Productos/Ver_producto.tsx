// src/pages/Ver_producto.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import { productoServices } from '../../services/producto.services';
import type { IProducto } from '../../entidades/producto';
import '../../assets/estilosProductos/verProducto.css';

const Ver_producto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<IProducto | null>(null);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    const cargarProducto = async () => {
      if (id) {
        const data = await productoServices.ObtenerProductoId(id);
        setProducto(data);
      }
    };
    cargarProducto();
  }, [id]);

  const handleComentarioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario) return;
    alert(`Gracias por tu comentario: "${comentario}"`);
    setComentario('');
  };

  if (!producto) return <p className="px-8 py-6">Cargando producto...</p>;

  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-6 flex-1">
          <div className="producto-detalle-card">
            <img
              src={producto.foto_producto || '/placeholder.png'}
              alt={producto.nombre_producto}
              className="producto-img mb-4"
            />
            <h2>{producto.nombre_producto}</h2>
            <p className="descripcion">{producto.descripcion_producto}</p>
            <p className="precio">${producto.precio}</p>

            <div className="btn-group mt-4">
              <button className="btn-comprar">🛒 Comprar</button>
              <button className="btn-volver" onClick={() => navigate('/catalogo')}>
                🔙 Volver al Catálogo
              </button>
            </div>

            <div className="comentario-section mt-6">
              <h3>Deja tu comentario</h3>
              <form onSubmit={handleComentarioSubmit}>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={4}
                  placeholder="Escribe tu comentario..."
                />
                <button type="submit" className="btn-comentar mt-2">💬 Comentar</button>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Ver_producto;
