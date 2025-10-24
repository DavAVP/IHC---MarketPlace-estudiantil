import { supabase } from './supabase.config';

export async function obtenerUsuarioCompleto() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data;
}
