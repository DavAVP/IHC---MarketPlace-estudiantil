import React, { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react';
import type { IUsuario } from '../entidades/IUsuario';
import { supabase } from '../data/supabase.config';

interface UsuarioContextType {
  usuario: IUsuario | null;
  setUsuario: (user: IUsuario | null) => void;
  refrescarUsuario: () => Promise<void>;
  cargando: boolean; // 🔹 nuevo
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [cargando, setCargando] = useState(true); // 🔹 nuevo

  const setUsuarioYStorage = (user: IUsuario | null) => {
    setUsuario(user);
    if (user) sessionStorage.setItem('usuario', JSON.stringify(user));
    else sessionStorage.removeItem('usuario');
  };

  const refrescarUsuario = async () => {
    setCargando(true);
    try {
      const { data: { user: userAuth } } = await supabase.auth.getUser();

      if (!userAuth) {
        setUsuarioYStorage(null);
      } else {
        const { data, error } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('auth_id', userAuth.id)
          .maybeSingle();

        if (error) {
          console.error('Error al obtener usuario:', error);
          setUsuarioYStorage(null);
        } else {
          setUsuarioYStorage(data ?? null);
        }
      }
    } catch (err) {
      console.error('Error refrescando usuario:', err);
      setUsuarioYStorage(null);
    }
    setCargando(false);
  };

  useEffect(() => {
    refrescarUsuario();
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario: setUsuarioYStorage, refrescarUsuario, cargando }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = (): UsuarioContextType => {
  const context = useContext(UsuarioContext);
  if (!context) throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  return context;
};
