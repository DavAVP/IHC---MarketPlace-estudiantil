// src/pages/Ver_producto.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import { productoServices } from '../../services/producto.services';
import type { IProducto } from '../../entidades/producto';
import { useIdioma } from '../../context/IdiomasContext';
import { useUsuario } from '../../context/UsuarioContext';
import { CarritoService } from '../../services/carrito.service';
import '../../assets/estilosProductos/verProducto.css';
import { toast } from 'react-hot-toast';

const Ver_producto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<IProducto | null>(null);
  const [comentario, setComentario] = useState('');
  const { translate } = useIdioma();
  const { usuario } = useUsuario();
  const [agregando, setAgregando] = useState(false);

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
    alert(`${translate('messages.commentThanks')} "${comentario}"`);
    setComentario('');
  };

  const handleAgregarCarrito = async () => {
    if (!producto) return;
    if (!usuario?.id) {
      toast.error(translate('messages.loginToBuy'));
      navigate('/login');
      return;
    }

    try {
      setAgregando(true);
      await CarritoService.agregarProducto(producto, usuario.id, 1);
      toast.success(translate('cart.added') || 'Agregado al carrito');
    } catch (err: any) {
      console.error('Error al agregar al carrito:', err);
      const detalle = err?.message ? `\n${err.message}` : '';
      alert(`No se pudo agregar el producto al carrito. Intenta nuevamente.${detalle}`);
    } finally {
      setAgregando(false);
    }
  };

  if (!producto) return <p className="px-8 py-6">{translate('productDetail.loading')}</p>;

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
              <button className="btn-comprar" onClick={handleAgregarCarrito} disabled={agregando}>
                {agregando ? translate('payment.processing') : translate('cart.add') || 'Agregar al carrito'}
              </button>
              <button className="btn-volver" onClick={() => navigate('/catalogo')}>
                {translate('productDetail.back')}
              </button>
            </div>

            <div className="comentario-section mt-6">
              <h3>{translate('productDetail.commentTitle')}</h3>
              <form onSubmit={handleComentarioSubmit}>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={4}
                  placeholder={translate('productDetail.commentPlaceholder')}
                />
                <button type="submit" className="btn-comentar mt-2">{translate('productDetail.commentAction')}</button>
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
