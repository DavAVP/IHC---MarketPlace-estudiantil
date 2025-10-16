import React, { useState } from 'react';
import { FaHome, FaUser, FaCog, FaBoxOpen, FaShoppingCart } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    { icon: <FaHome />, label: 'Inicio', link: '/home' },
    { icon: <FaBoxOpen />, label: 'Productos', link: '/productos' },
    { icon: <FaShoppingCart />, label: 'Mis Compras', link: '/compras' },
    { icon: <FaUser />, label: 'Perfil', link: '/perfil' },
    { icon: <FaCog />, label: 'Configuración', link: '/config' },
  ];

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
      </nav>
    </aside>
  );
};

export default Sidebar;
