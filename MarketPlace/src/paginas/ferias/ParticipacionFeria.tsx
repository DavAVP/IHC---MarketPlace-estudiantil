import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import Categorias from '../../componentes/categorias';
import { FeriaService } from '../../services/feria.service';
import { productoServices } from '../../services/producto.services';
import { ParticipacionService } from '../../services/participacion.service';
import type { IFeria } from '../../entidades/Feria';
import type { IProducto } from '../../entidades/producto';
import { useIdioma } from '../../context/IdiomasContext';
import { useUsuario } from '../../context/UsuarioContext';
import { toast } from 'react-hot-toast';
import '../../assets/estilosHome/participacionFeria.css';

const ParticipacionFeria: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { translate } = useIdioma();
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  const [feria, setFeria] = useState<IFeria | null>(null);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<IProducto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [participando, setParticipando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [registrando, setRegistrando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      setCargando(true);
      try {
        const [feriaData, productosData] = await Promise.all([
          FeriaService.ObtenerFeriasID(id),
          productoServices.ObtenerProductosPorFeria(id)
        ]);

        setFeria(feriaData);
        setProductos(productosData ?? []);
        setProductosFiltrados(productosData ?? []);

        if (usuario?.id) {
          const participacion = await ParticipacionService.obtenerParticipacion(id, usuario.id);
          setParticipando(Boolean(participacion));
        } else {
          setParticipando(false);
        }
      } catch (err) {
        console.error('Error cargando participación de feria:', err);
        toast.error(translate('feriaParticipation.loadError'));
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, usuario?.id, translate]);

  const handleFiltrarCategoria = (categoriaId: string | null) => {
    setCategoriaSeleccionada(categoriaId);
    if (!categoriaId) {
      setProductosFiltrados(productos);
      return;
    }
    setProductosFiltrados(productos.filter(prod => prod.categoria_id === categoriaId));
  };

  const handleParticipar = async () => {
    if (!id) return;
    if (!usuario?.id) {
      toast.error(translate('messages.loginToParticipate'));
      navigate('/login');
      return;
    }

    try {
      setRegistrando(true);
      const resultado = await ParticipacionService.registrarParticipacion(id, usuario.id);
      if (resultado) {
        setParticipando(true);
        toast.success(translate('feriaParticipation.joinSuccess'));
      } else {
        toast.error(translate('feriaParticipation.joinError'));
      }
    } catch (err) {
      console.error('Error al registrar participación:', err);
      toast.error(translate('feriaParticipation.joinError'));
    } finally {
      setRegistrando(false);
    }
  };

  const productosOrdenados = useMemo(
    () => productosFiltrados.slice().sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto)),
    [productosFiltrados]
  );

  if (cargando) {
    return <p className="px-8 py-6">{translate('common.loading')}</p>;
  }

  if (!feria) {
    return <p className="px-8 py-6">{translate('feriaParticipation.notFound')}</p>;
  }

  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-6 flex-1">
          <div className="participacion-header">
            <div>
              <h2>{translate('feriaParticipation.title').replace('{name}', feria.nombre_feria)}</h2>
              <p>{translate('feriaParticipation.subtitle')}</p>
              <div className="participacion-meta">
                <span>{translate('feriaParticipation.dateRange').replace('{start}', feria.fechaInicio).replace('{end}', feria.fechaFin)}</span>
                <span>{translate('feriaParticipation.type').replace('{type}', feria.tipo)}</span>
              </div>
              {feria.reglas && (
                <p className="participacion-reglas">
                  <strong>{translate('feriaParticipation.rules')}:</strong> {feria.reglas}
                </p>
              )}
            </div>

            <button
              type="button"
              className="participacion-btn"
              onClick={handleParticipar}
              disabled={participando || registrando}
            >
              {participando
                ? translate('feriaParticipation.participating')
                : registrando
                  ? translate('feriaParticipation.joining')
                  : translate('feriaParticipation.joinButton')}
            </button>
          </div>

          <div className="card-section mb-6">
            <h3>{translate('catalog.categories')}</h3>
            <Categorias
              onSelectCategoria={handleFiltrarCategoria}
              categoriaSeleccionada={categoriaSeleccionada}
            />
          </div>

          <div className="card-section">
            <h3>{translate('feriaParticipation.productsTitle')}</h3>
            {productosOrdenados.length === 0 ? (
              <p>{translate('feriaParticipation.empty')}</p>
            ) : (
              <div className="productos-grid">
                {productosOrdenados.map((producto) => (
                  <div key={producto.id_producto} className="producto-card">
                    <img src={producto.foto_producto || '/placeholder.png'} alt={producto.nombre_producto} />
                    <h4>{producto.nombre_producto}</h4>
                    <p>{producto.descripcion_producto}</p>
                    <span className="precio">${producto.precio}</span>
                    <button
                      className="btn-ver-producto"
                      onClick={() => navigate(`/ver-producto/${producto.id_producto}`)}
                    >
                      {translate('catalog.view')}
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

export default ParticipacionFeria;
