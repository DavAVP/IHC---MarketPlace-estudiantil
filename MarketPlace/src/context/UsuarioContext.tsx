import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { IUsuario } from '../entidades/Usuario';

interface UsuarioContextType {
  usuario: IUsuario | null;
  setUsuario: (user: IUsuario | null) => void;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = (): UsuarioContextType => {
  const context = useContext(UsuarioContext);
  if (!context) throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  return context;
};
