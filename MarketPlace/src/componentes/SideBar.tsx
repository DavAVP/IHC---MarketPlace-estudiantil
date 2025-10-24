import React, { useState } from 'react';
import { FaHome, FaUser, FaCog, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import { supabase } from '../data/supabase.config'; // 👈 importa tu cliente

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaHome />, label: 'Inicio', link: '/home' },
    { icon: <FaBoxOpen />, label: 'Productos', link: '/productos' },
    { icon: <FaShoppingCart />, label: 'Mis Compras', link: '/compras' },
    { icon: <FaUser />, label: 'Perfil', link: '/perfil' },
    { icon: <FaCog />, label: 'Configuración', link: '/config' },
    { icon: <FaInfoCircle />, label: 'Acerca de', link: '/acerca-de' },
  ];

  const handleLogout = async () => {
    try {
      // 🔹 Cierra sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 🔹 Limpia el contexto global de usuario
      setUsuario(null);

      // 🔹 Redirige al login
      navigate('/login');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <aside className={`sidebar ${expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <button className="sidebar-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? '◀' : '▶'}
      </button>

      <nav className="sidebar-nav">
        {menuItems.map((item, i) => (
          <a href={item.link} key={i} className="sidebar-item">
            {item.icon}
            {expanded && <span className="sidebar-label">{item.label}</span>}
          </a>
        ))}

        {/* 🔹 Botón Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="sidebar-item logout-btn"
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 15px',
            fontSize: '1rem',
            color: 'inherit',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <FaSignOutAlt />
          {expanded && <span className="sidebar-label" style={{ marginLeft: 10 }}>Cerrar Sesión</span>}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
