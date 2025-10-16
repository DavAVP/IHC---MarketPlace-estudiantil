import { Link } from 'react-router-dom';
import type { IUsuario } from '../entidades/Usuario';
import { useState } from 'react';
import BarraBusqueda from './BarraBusqueda';

interface NavbarProps {
  usuario: IUsuario;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ usuario, onSearch }) => {
  const [showCategorias, setShowCategorias] = useState(false);
  const categorias = ["Tecnología", "Ropa", "Calzado", "Hogar", "Deportes"];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">StudensPlaces</div>

      {/* Links + Dropdown */}
      <div className="navbar-links">
        <Link to="/home">Inicio</Link>
        {usuario.rol === 'estudiante' && <Link to="/edicion/subir">Subir Producto</Link>}
        <Link to="/acercade">Acerca de</Link>

        {/* Dropdown Categorías */}
        <div
          className="navbar-categorias"
          onMouseEnter={() => setShowCategorias(true)}
          onMouseLeave={() => setShowCategorias(false)}
        >
          <button className="btn-categorias">Categorías ▾</button>
          {showCategorias && (
            <div className="dropdown">
              {categorias.map((cat, i) => (
                <Link to={`/categoria/${cat.toLowerCase()}`} key={i}>
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barra de búsqueda (en la misma línea que links y usuario) */}
      <div className="navbar-search">
        <BarraBusqueda onSearch={onSearch} />
      </div>

      {/* Usuario */}
      <div className="navbar-user">
        {usuario.fotoPerfil ? (
          <img src={usuario.fotoPerfil} alt="Avatar" />
        ) : (
          <span>{usuario.nombre}</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
