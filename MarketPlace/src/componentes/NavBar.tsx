import { Link } from 'react-router-dom';
import { useState } from 'react';
import BarraBusqueda from './BarraBusqueda';
import { useUsuario } from '../context/UsuarioContext';
import "../assets/estilosComponentes/componentes.css"

const Navbar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const { usuario } = useUsuario();
  const [showCategorias, setShowCategorias] = useState(false);
  const categorias = ["Tecnología", "Ropa", "Calzado", "Hogar", "Deportes"];

  return (
    <nav className="navbar">
      <div className="navbar-logo">StudensPlaces</div>
      <div className="navbar-links">
        <Link to="/home">Inicio</Link>
        {!usuario?.esAdmin && <Link to="/edicion/subir">Subir Producto</Link>}
        {usuario?.esAdmin && <Link to="/admin/feria">Panel de Ferias</Link>}
        <Link to="/acercade">Acerca de</Link>

        <div className="navbar-categorias" onMouseEnter={() => setShowCategorias(true)} onMouseLeave={() => setShowCategorias(false)}>
          <button className="btn-categorias">Categorías ▾</button>
          {showCategorias && (
            <div className="dropdown">
              {categorias.map((cat, i) => <Link to={`/categoria/${cat.toLowerCase()}`} key={i}>{cat}</Link>)}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-search"><BarraBusqueda onSearch={onSearch} /></div>
      <div className="navbar-user">
        {usuario?.fotoPerfil ? <img src={usuario.fotoPerfil} alt="Avatar" /> : <span>{usuario?.nombre || 'Invitado'}</span>}
      </div>
    </nav>
  );
};

export default Navbar;
