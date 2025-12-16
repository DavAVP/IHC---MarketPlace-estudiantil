// src/pages/Carrito.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import { useIdioma } from '../../context/IdiomasContext';
import { useUsuario } from '../../context/UsuarioContext';
import { CarritoService } from '../../services/carrito.service';
import type { ICarrito } from '../../entidades/ICarrito';
import '../../assets/estilosProductos/carrito.css';

const Carrito: React.FC = () => {
  const { translate } = useIdioma();
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const [items, setItems] = useState<Array<ICarrito & { id?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const msg = localStorage.getItem('lastPurchaseMessage');
    if (msg) {
      setPurchaseMessage(msg);
      localStorage.removeItem('lastPurchaseMessage');
      localStorage.removeItem('lastPurchaseStatus');
    }
  }, []);

  useEffect(() => {
    const cargar = async () => {
      if (!usuario?.id) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        setError('');
        setLoading(true);
        const data = await CarritoService.obtenerPorUsuario(usuario.id);
        setItems(data);
      } catch (err: any) {
        console.error('Error cargando carrito:', err);
        setError(err?.message ?? 'No se pudo cargar el carrito');
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [usuario?.id]);

  const subtotal = items.reduce((acc, it) => acc + Number(it.precio ?? 0) * Number(it.cantidad ?? 0), 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;
  const formatMoney = (value: number) => `$${value.toFixed(2)}`;

  const handleDelete = async (itemId?: string) => {
    if (!itemId) return;
    try {
      setRemovingId(itemId);
      await CarritoService.eliminar(itemId);
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    } catch (err: any) {
      console.error('Error eliminando producto del carrito:', err);
      const detalle = err?.message ? `\n${err.message}` : '';
      alert(`No se pudo eliminar el producto. Intenta nuevamente.${detalle}`);
    } finally {
      setRemovingId(null);
    }
  };

  const handleQuantityChange = async (itemId?: string, newQty?: number) => {
    if (!itemId) return;
    const qty = Math.max(1, Number(newQty) || 1);
    try {
      setUpdatingId(itemId);
      await CarritoService.actualizarCantidad(itemId, qty);
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, cantidad: qty } : it)));
    } catch (err: any) {
      console.error('Error actualizando cantidad:', err);
      const detalle = err?.message ? `\n${err.message}` : '';
      alert(`No se pudo actualizar la cantidad. Intenta nuevamente.${detalle}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />
        <div className="px-8 py-6 flex-1">
          <h2 className="text-2xl font-semibold mb-4">{translate('cart.title')}</h2>
          {purchaseMessage && (
            <div className="carrito-banner exito">
              <span>Comprado ✅</span>
              <strong>{purchaseMessage}</strong>
            </div>
          )}
          {loading && <p>{translate('common.loading') || 'Cargando...'}</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="carrito-empty">{translate('cart.empty')}</p>
          )}

          {!loading && items.length > 0 && (
            <div className="carrito-wrapper">
              <div className="carrito-list">
                {items.map((item) => {
                  const unit = Number(item.precio ?? 0);
                  const qty = Number(item.cantidad ?? 0);
                  const subtotalItem = unit * qty;

                  return (
                    <div key={item.id ?? `${item.id_producto}-${unit}`} className="carrito-item">
                      <div>
                        <p className="carrito-item-title">{item.nombre_producto}</p>
                        <p className="carrito-item-meta">
                          {(translate('cart.quantity') as string) || 'Cantidad'}: {qty}
                        </p>
                      </div>
                      <div>
                        <p className="carrito-item-price">{formatMoney(unit)}</p>
                        <p className="carrito-item-subtotal">
                          {(translate('cart.subtotal') as string) || 'Subtotal'}: {formatMoney(subtotalItem)}
                        </p>
                        <div className="carrito-qty">
                          <span className="carrito-item-meta">{translate('cart.quantity') || 'Cantidad'}:</span>
                          <div className="carrito-qty-controls">
                            <button
                              onClick={() => handleQuantityChange(item.id, qty - 1)}
                              disabled={qty <= 1 || updatingId === item.id || removingId === item.id}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={qty}
                              onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                              disabled={updatingId === item.id || removingId === item.id}
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, qty + 1)}
                              disabled={updatingId === item.id || removingId === item.id}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          className="carrito-btn-secondary"
                          onClick={() => handleDelete(item.id)}
                          disabled={removingId === item.id}
                        >
                          {removingId === item.id
                            ? translate('common.loading') || 'Eliminando...'
                            : translate('common.actions.delete') || 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="carrito-total">
                <div>
                  <p className="carrito-item-meta">Subtotal</p>
                  <p className="carrito-item-meta">IVA (15%)</p>
                  <strong>Total</strong>
                </div>
                <div className="text-right">
                  <p className="carrito-item-price">{formatMoney(subtotal)}</p>
                  <p className="carrito-item-price">{formatMoney(iva)}</p>
                  <strong className="carrito-item-price">{formatMoney(total)}</strong>
                </div>
              </div>

              <div className="carrito-actions">
                <button
                  className="carrito-btn-primary"
                  onClick={() => navigate('/pago')}
                >
                  {translate('cart.payment') || translate('navbar.links.cart') || 'Pagar'}
                </button>
              </div>
            </div>
          )}
        </div>
        {!usuario && (
          <div className='iniciar-sesion-carrito'>
            <p>{translate('cart.cartInfo') || translate('cart.carritoInfo') || 'Inicia sesión para usar el carrito.'}</p>
            <button onClick={() => window.location.href = '/login'}>{translate('login.loginButton')}</button>
            <button onClick={() => window.location.href = '/registro'}>{translate('login.registerLink')}</button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Carrito;
