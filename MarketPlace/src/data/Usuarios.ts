import { supabase } from "../data/supabase.config";
import type { IUsuario } from "../entidades/IUsuario";

export async function obtenerUsuarioCompleto(): Promise<IUsuario | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    console.log("❌ No se encontró el usuario:", error?.message);
    return null;
  }

  return {
    id: data.id,
    nombre: data.nombre,
    correo: data.correo,
    esAdmin: data.esAdmin,
    fotoPerfil: data.fotoPerfil,
  };
}
