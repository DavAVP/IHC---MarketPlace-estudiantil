// src/pages/Carrito.tsx
import React from 'react';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';

const Carrito: React.FC = () => {
  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />
        <div className="px-8 py-6 flex-1">
          <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>
          <p>Aquí se mostrarán los productos que el usuario agregue al carrito.</p>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Carrito;
