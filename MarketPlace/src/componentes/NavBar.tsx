import { Link } from 'react-router-dom'
import type { IUsuario } from '../entidades/Usuario'

interface NavbarProps {
  usuario: IUsuario
}

const Navbar: React.FC<NavbarProps> = ({ usuario }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">StudensPlaces</div>
      <div className="navbar-links">
        <Link to="/home">Inicio</Link>
        {usuario.rol === 'estudiante' && <Link to="/edicion/subir">Subir Producto</Link>}
        <Link to="/acercade">Acerca de</Link>
      </div>
      <div className="navbar-user">
        {usuario.fotoPerfil ? (
          <img src={usuario.fotoPerfil} alt="Avatar" />
        ) : (
          <span>{usuario.nombre}</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar
