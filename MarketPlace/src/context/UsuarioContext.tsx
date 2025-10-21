import React, { createContext, useContext, useState} from 'react';
import type { IUsuario } from '../entidades/IUsuario';
import type { ReactNode } from 'react';
import { supabase } from '../../supabase.config';
import { useEffect } from 'react';

interface UsuarioContextType {
  usuario: IUsuario | null;
  setUsuario: (user: IUsuario | null) => void;
  refrescarUsuario: () => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

// Función para traer el usuario logueado desde Supabase
  const refrescarUsuario = async () => {
    try {
      const { data: { user: userAuth } } = await supabase.auth.getUser();

      if (!userAuth) {
        setUsuario(null);
        return;
      }

      const { data, error } = await supabase
        .from<IUsuario>('usuarios')
        .select('*')
        .eq('id', userAuth.id)
        .single();

      if (error) {
        console.error('Error al obtener usuario:', error);
        setUsuario(null);
        return;
      }

      setUsuario(data ?? null);
    } catch (err) {
      console.error('Error refrescando usuario:', err);
      setUsuario(null);
    }
  };

  // Refrescar usuario al montar el provider
  useEffect(() => {
    refrescarUsuario();
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario, refrescarUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = (): UsuarioContextType => {
  const context = useContext(UsuarioContext);
  if (!context) throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  return context;
};
