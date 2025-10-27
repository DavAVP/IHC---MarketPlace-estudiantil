import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/login/Login';
import Registro from './paginas/login/Registro';
import Home from './paginas/home/Home';
import AdminFeria from './paginas/administrador/AdminFeria';
import SubirProductos from './paginas/Productos/Subir_producto';
import AcercaDe from './paginas/home/Acercade';
import Carrito from './paginas/carrito/carrito';
import Catalogo from './paginas/home/catalogo';
import { Perfil } from './paginas/Perfil/Perfil';
import EditarPerfil from './paginas/Perfil/editarPerfil';
import RecuperarPassword from './paginas/login/RecuperarPassword'
import Ver_producto from './paginas/Productos/Ver_producto';

import { UsuarioProvider, useUsuario } from './context/UsuarioContext';
import type { JSX } from 'react';


const PrivateRoute = ({ children, admin }: { children: JSX.Element, admin?: boolean }) => {
  const { usuario, cargando } = useUsuario();

  if (cargando) return null; 

  if (!usuario) return <Navigate to="/login" />;
  if (admin && !usuario.esAdmin) return <Navigate to="/home" />;
  return children;
};

function App() {
  return (
    <UsuarioProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/subir-productos" element={<PrivateRoute><SubirProductos /></PrivateRoute>} />
        <Route path="/admin/feria" element={<PrivateRoute admin><AdminFeria /></PrivateRoute>} />
        <Route path="/acerca-de" element={<PrivateRoute><AcercaDe /></PrivateRoute>} />
        <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
        <Route path="/catalogo" element={<PrivateRoute><Catalogo /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/editar-perfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/ver-producto/:id" element={<Ver_producto />} />

        <Route path="*" element={<Navigate to="/login" />} />


      </Routes>
    </UsuarioProvider>
  );
}

export default App;
