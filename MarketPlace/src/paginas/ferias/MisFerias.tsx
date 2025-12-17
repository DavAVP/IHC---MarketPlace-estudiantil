import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import { FeriaService } from '../../services/feria.service';
import { ParticipacionService } from '../../services/participacion.service';
import type { IFeria } from '../../entidades/Feria';
import { useIdioma } from '../../context/IdiomasContext';
import { useUsuario } from '../../context/UsuarioContext';

const MisFerias: React.FC = () => {
  const { translate } = useIdioma();
  const { usuario, cargando } = useUsuario();
  const navigate = useNavigate();
  const [ferias, setFerias] = useState<IFeria[]>([]);
  const [cargandoFerias, setCargandoFerias] = useState(true);

  useEffect(() => {
    if (cargando) return;

    let activo = true;

    const cargarFerias = async () => {
      if (!usuario?.id) {
        if (activo) {
          setFerias([]);
          setCargandoFerias(false);
        }
        return;
      }

      if (activo) setCargandoFerias(true);

      try {
        const [participaciones, todasFerias] = await Promise.all([
          ParticipacionService.obtenerParticipacionesPorUsuario(usuario.id),
          FeriaService.ObtenerFerias()
        ]);

        if (!activo) return;

        const feriasUsuario = todasFerias.filter((feria) =>
          participaciones.some((participacion) => participacion.feriaID === feria.id_feria)
        );

        setFerias(feriasUsuario);
      } catch (error) {
        console.error('Error al cargar ferias del usuario:', error);
        if (activo) setFerias([]);
      } finally {
        if (activo) setCargandoFerias(false);
      }
    };

    cargarFerias();

    return () => {
      activo = false;
    };
  }, [usuario?.id, cargando]);

  if (cargandoFerias) {
    return <p className="px-8 py-6">{translate('common.loading')}</p>;
  }

  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-6 flex-1">
          <div className="home-banner mb-6">
            <h2>{translate('myFairs.title')}</h2>
            <p>{translate('myFairs.subtitle')}</p>
          </div>

          {ferias.length === 0 ? (
            <p>{translate('myFairs.empty')}</p>
          ) : (
            <div className="productos-grid">
              {ferias.map((feria) => (
                <div key={feria.id_feria} className="producto-card">
                  <h4>{feria.nombre_feria}</h4>
                  <p>{translate('feriaParticipation.dateRange').replace('{start}', feria.fechaInicio).replace('{end}', feria.fechaFin)}</p>
                  <p>{translate('feriaParticipation.type').replace('{type}', feria.tipo)}</p>
                  {feria.reglas && <p>{feria.reglas}</p>}
                  <button
                    type="button"
                    className="btn-ver-producto"
                    onClick={() => navigate(`/ferias/${feria.id_feria}/participacion`)}
                  >
                    {translate('myFairs.cta')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MisFerias;
