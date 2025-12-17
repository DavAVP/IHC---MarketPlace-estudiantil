import { supabase } from "../data/supabase.config";
import type { IUsuario } from "../entidades/IUsuario";

export const authService = {

  //Login con email/password
  loginWithEmail: async (email: string, password: string): Promise<IUsuario | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) return null;

    const { data: usuarioDB } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!usuarioDB) return null;

    return {
      id: usuarioDB.id,
      nombre: usuarioDB.nombre,
      correo: usuarioDB.correo,
      esAdmin: usuarioDB.esAdmin,
      fotoPerfil: usuarioDB.fotoPerfil,
    };
  },

  //Registro con email/password
  registerWithEmail: async (email: string, password: string, nombre: string): Promise<IUsuario | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) return null;

    const userId = data.user.id;

    const { error: insertError } = await supabase
      .from("Usuarios")
      .insert([{ id: userId, correo: email, nombre }]);

    if (insertError) {
      if (insertError.message.includes("row-level security")) {
        throw new Error("Revisa las políticas RLS de la tabla Usuarios; el usuario autenticado debe poder insertar su propio registro.");
      }
      throw new Error(insertError.message);
    }

    const { data: usuarioDB, error: fetchError } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError || !usuarioDB) throw new Error(fetchError?.message || "Error al recuperar usuario");

    return {
      id: usuarioDB.id,
      nombre: usuarioDB.nombre,
      correo: usuarioDB.correo,
      esAdmin: usuarioDB.esAdmin,
      fotoPerfil: usuarioDB.fotoPerfil,
    };
  },

  resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/reset-password', // cambia según tu URL
  });
  },
  //Login con Google
  loginWithGoogle: async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw new Error(error.message);
  },

  //Login con GitHub
  loginWithGithub: async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw new Error(error.message);
  },

  //Crear o traer usuario OAuth automáticamente
  createOrFetchOAuthUser: async (authUser: any): Promise<IUsuario> => {
    const { data: usuarioDB, error: dbError } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (dbError) throw new Error(dbError.message);

    if (usuarioDB) {
      return {
        id: usuarioDB.id,
        nombre: usuarioDB.nombre,
        correo: usuarioDB.correo,
        esAdmin: usuarioDB.esAdmin,
        fotoPerfil: usuarioDB.fotoPerfil,
      };
    } else {
      // Insertamos usuario nuevo con datos de OAuth
      const { data: newUser, error: insertError } = await supabase
        .from("Usuarios")
        .insert([{
          id: authUser.id,
          nombre: authUser.user_metadata?.full_name || authUser.email.split("@")[0],
          correo: authUser.email,
          fotoPerfil: authUser.user_metadata?.avatar_url || null,
        }])
        .select()
        .maybeSingle();

      if (insertError) {
        if (insertError.message.includes("row-level security")) {
          throw new Error("Revisa las políticas RLS de la tabla Usuarios para permitir inserciones del propietario en OAuth.");
        }
        throw new Error(insertError.message);
      }

      if (!newUser) throw new Error("Error al crear usuario OAuth");

      return {
        id: newUser.id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        esAdmin: newUser.esAdmin,
        fotoPerfil: newUser.fotoPerfil,
      };
    }
  },

  //Logout
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  //Obtener usuario actual
  getCurrentUser: async (): Promise<IUsuario | null> => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return await authService.createOrFetchOAuthUser(data.user);
  },
};
