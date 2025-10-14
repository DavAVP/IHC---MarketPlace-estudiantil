import { Link } from 'react-router-dom';
import type { IUsuario } from '../entidades/Usuario';
import { useState } from 'react';

interface NavbarProps {
  usuario: IUsuario;
}

const Navbar: React.FC<NavbarProps> = ({ usuario }) => {
  const [showCategorias, setShowCategorias] = useState(false);

  const categorias = ["Tecnología", "Ropa", "Calzado", "Hogar", "Deportes"];

  return (
    <nav className="navbar">
      <div className="navbar-logo">StudensPlaces</div>

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
