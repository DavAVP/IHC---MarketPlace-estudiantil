import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BarraBusqueda from './BarraBusqueda';
import { LanguageSelector } from './LanguageSelector';
import { useUsuario } from '../context/UsuarioContext';
import { useIdioma } from '../context/IdiomasContext';
import '../assets/estilosComponentes/componentes.css';
import '../assets/estilosComponentes/NavbarSidebar.css';

const Navbar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const { usuario } = useUsuario();
  const { translate } = useIdioma();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => {
      const links: Array<{ to: string; label: string }> = [
        { to: '/home', label: translate('navbar.links.home') },
        { to: '/catalogo', label: translate('navbar.links.catalog') },
        { to: '/acerca-de', label: translate('navbar.links.about') },
        { to: '/mis-productos', label: translate('navbar.links.myProducts') },
        { to: '/carrito', label: translate('navbar.links.cart') },
        { to: '/perfil', label: translate('navbar.links.profile') }
      ];

      if (usuario?.esAdmin) {
        links.splice(2, 0, {
          to: '/admin/feria',
          label: translate('navbar.links.admin')
        });
      } else {
        links.splice(2, 0, {
          to: '/subir-productos',
          label: translate('navbar.links.upload')
        });
      }

      return links;
    },
    [translate, usuario?.esAdmin]
  );

  const navId = 'primary-navigation';

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleLabel = translate('navbar.toggle');

  return (
    <nav className="navbar" aria-label={translate('common.brand')}>
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label={toggleLabel}
          aria-expanded={menuOpen}
          aria-controls={navId}
        >
          ☰
        </button>

        <div className="navbar-logo">{translate('common.brand')}</div>
      </div>

      <div
        id={navId}
        className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}
        role="menubar"
      >
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} onClick={closeMenu} role="menuitem">
            {label}
          </Link>
        ))}
      </div>

      <div className="navbar-search">
        <BarraBusqueda onSearch={onSearch} />
      </div>

      <div className="navbar-tools">
        <LanguageSelector />
        <div className="navbar-user">
          {usuario?.fotoPerfil ? (
            <img src={usuario.fotoPerfil} alt="Avatar" />
          ) : (
            <span>{usuario?.nombre || translate('common.guest')}</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
