import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './paginas/login/Login';
import Registro from './paginas/login/Registro';
import Home from './paginas/home/Home';
import AdminFeria from './paginas/administrador/AdminFeria';
import SubirProductos from './paginas/Productos/Subir_producto';
import AcercaDe from './paginas/home/Acercade';
import Carrito from './paginas/carrito/carrito';
import Pago from './paginas/pago/Pago';
import Catalogo from './paginas/home/catalogo';
import Perfil from './paginas/Perfil/Perfil';
import RecuperarPassword from './paginas/login/RecuperarPassword'
import Ver_producto from './paginas/Productos/Ver_producto';
import MisProductos from './paginas/Productos/Mis_productos';
import EditarProducto from './paginas/Productos/Editar_producto';
import ParticipacionFeria from './paginas/ferias/ParticipacionFeria';
import MisFerias from './paginas/ferias/MisFerias';

import { UsuarioProvider, useUsuario } from './context/UsuarioContext';
import type { JSX } from 'react';
import { KeyboardShortcuts } from './componentes/KeyboardShortcuts';
import { Toaster } from 'react-hot-toast';


const PrivateRoute = ({ children, admin }: { children: JSX.Element; admin?: boolean }) => {
  const { usuario, cargando } = useUsuario();
  const location = useLocation();

  if (cargando) return null;

  if (!usuario) return <Navigate to="/login" state={{ from: location }} replace />;
  if (admin && !usuario.esAdmin) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <UsuarioProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <KeyboardShortcuts />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/acerca-de" element={<AcercaDe />} />

        <Route path="/subir-productos" element={<PrivateRoute><SubirProductos /></PrivateRoute>} />
        <Route path="/admin/feria" element={<PrivateRoute admin><AdminFeria /></PrivateRoute>} />
        <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/mis-productos" element={<PrivateRoute><MisProductos /></PrivateRoute>} />
        <Route path="/mis-ferias" element={<PrivateRoute><MisFerias /></PrivateRoute>} />
        <Route path="/editar-producto/:id_producto" element={<PrivateRoute><EditarProducto /></PrivateRoute>} />
        <Route path="/ver-producto/:id" element={<Ver_producto />} />
        <Route path="/ferias/:id/participacion" element={<PrivateRoute><ParticipacionFeria /></PrivateRoute>} />
        <Route path='/pago' element={<PrivateRoute><Pago /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />


      </Routes>
    </UsuarioProvider>
  );
}

export default App;
