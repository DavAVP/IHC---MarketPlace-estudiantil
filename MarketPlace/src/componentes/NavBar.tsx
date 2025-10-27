import { Link } from 'react-router-dom';
import BarraBusqueda from './BarraBusqueda';
import { useUsuario } from '../context/UsuarioContext';
import "../assets/estilosComponentes/componentes.css"

const Navbar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const { usuario } = useUsuario();

  return (
    <nav className="navbar">
      <div className="navbar-logo">StudensPlaces</div>

      <div className="navbar-links">
        <Link to="/home">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        {!usuario?.esAdmin && <Link to="/subir-productos">Subir Producto</Link>}
        {usuario?.esAdmin && <Link to="/admin/feria">Panel de Ferias</Link>}
        <Link to="/acerca-de">Acerca de</Link>
      </div>

      <div className="navbar-search">
        <BarraBusqueda onSearch={onSearch} />
      </div>

      <div className="navbar-user">
        {usuario?.fotoPerfil ? <img src={usuario.fotoPerfil} alt="Avatar" /> : <span>{usuario?.nombre || 'Invitado'}</span>}
      </div>
    </nav>
  );
};

export default Navbar;
