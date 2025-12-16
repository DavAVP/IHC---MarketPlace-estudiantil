import React, { useCallback, useState } from 'react';
import { FaHome, FaUser, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaInfoCircle, FaListAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import { supabase } from '../data/supabase.config';
import { useIdioma } from '../context/IdiomasContext';
import "../assets/estilosComponentes/NavbarSidebar.css";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { usuario, setUsuario } = useUsuario();
  const navigate = useNavigate();
  const { translate } = useIdioma();

  const menuItems = [
    { icon: <FaHome />, label: translate('navbar.links.home'), link: '/home' },
    usuario?.esAdmin
      ? { icon: <FaBoxOpen />, label: translate('navbar.links.admin'), link: '/admin/feria' }
      : { icon: <FaBoxOpen />, label: translate('navbar.links.upload'), link: '/subir-productos' },
    { icon: <FaListAlt />, label: translate('navbar.links.myProducts'), link: '/mis-productos' },
    { icon: <FaShoppingCart />, label: translate('navbar.links.cart'), link: '/carrito' },
    { icon: <FaUser />, label: translate('navbar.links.profile'), link: '/perfil' },
    { icon: <FaInfoCircle />, label: translate('navbar.links.about'), link: '/acerca-de' }
  ];

  const collapseIfMobile = useCallback(() => {
    if (typeof window === 'undefined') return;
    const matcher = window.matchMedia('(max-width: 1024px)');
    if (matcher.matches) {
      setExpanded(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUsuario(null);
      collapseIfMobile();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const toggleSidebar = () => setExpanded((prev) => !prev);

  const toggleLabel = expanded ? translate('common.actions.close') : translate('navbar.toggle');

  const handleMenuItemClick = () => {
    collapseIfMobile();
  };

  return (
    <>
      {!expanded && (
        <button
          type="button"
          className="sidebar-floating-toggle"
          onClick={toggleSidebar}
          aria-label={toggleLabel}
          aria-expanded={expanded}
        >
          ☰
        </button>
      )}

      <div
        className={`sidebar-overlay ${expanded ? 'active' : ''}`}
        aria-hidden={!expanded}
        onClick={expanded ? toggleSidebar : undefined}
      />

      <aside
        className={`sidebar ${expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
        aria-expanded={expanded}
        aria-label="Secondary navigation"
      >
        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={toggleLabel}
            aria-expanded={expanded}
          >
            {expanded ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar">
          {menuItems.map((item) => (
            <Link to={item.link} key={item.link} className="sidebar-item" onClick={handleMenuItemClick}>
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {usuario ? (
          <button type="button" onClick={handleLogout} className="sidebar-item logout-btn">
            <span className="sidebar-icon" aria-hidden="true">
              <FaSignOutAlt />
            </span>
            <span className="sidebar-label">{translate('sidebar.logout')}</span>
          </button>
        ) : (
          <div className="sidebar-auth">
            <Link to="/login" className="sidebar-item" onClick={handleMenuItemClick}>
              <span className="sidebar-label">{translate('login.loginButton')}</span>
            </Link>
            <Link to="/registro" className="sidebar-item" onClick={handleMenuItemClick}>
              <span className="sidebar-label">{translate('login.registerLink')}</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
