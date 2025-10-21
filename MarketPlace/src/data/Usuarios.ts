import { supabase } from '../../supabase.config';
import type { IUsuario } from '../entidades/IUsuario';

async function obtenerUsuarioCompleto(): Promise<IUsuario | null> {
  const { data: userAuth } = await supabase.auth.getUser();
  if (!userAuth.user) return null;

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userAuth.user.id)
    .single();

  if (error) {
    console.error('Error al traer usuario de la DB:', error);
    return null;
  }

  return data;
}

export { obtenerUsuarioCompleto };
