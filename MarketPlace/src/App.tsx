import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/login/Login';
import Registro from './paginas/login/crearCuenta';
import Home from './paginas/home/Home';
import AdminFeria from './paginas/administrador/AdminFeria';
import SubirProductos from './paginas/Edicion/Subir_producto';
import AcercaDe from './paginas/home/Acercade';
import { UsuarioProvider, useUsuario } from './context/UsuarioContext';
import type { JSX } from 'react';

const PrivateRoute = ({ children, admin }: { children: JSX.Element, admin?: boolean }) => {
  const { usuario } = useUsuario();
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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </UsuarioProvider>
  );
}

export default App;
