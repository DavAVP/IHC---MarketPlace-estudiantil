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
      .eq("auth_id", data.user.id)
      .maybeSingle();

    if (!usuarioDB) return null;

    return {
      id: usuarioDB.id,
      nombre: usuarioDB.nombre,
      correo: usuarioDB.correo,
      password,
      esAdmin: usuarioDB.esAdmin,
      fotoPerfil: usuarioDB.fotoPerfil,
    };
  },

  //Registro con email/password
  registerWithEmail: async (email: string, password: string, nombre: string): Promise<IUsuario | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) return null;

    const { data: usuarioDB, error: dbError } = await supabase
      .from("Usuarios")
      .insert([{ auth_id: data.user.id, correo: email, nombre, esAdmin: false }])
      .select()
      .maybeSingle();

    if (dbError || !usuarioDB) throw new Error(dbError?.message || "Error al crear usuario");

    return {
      id: usuarioDB.id,
      nombre: usuarioDB.nombre,
      correo: usuarioDB.correo,
      password, // opcional
      esAdmin: usuarioDB.esAdmin,
      fotoPerfil: usuarioDB.fotoPerfil,
    };
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
      .eq("auth_id", authUser.id)
      .maybeSingle();

    if (dbError) throw new Error(dbError.message);

    if (usuarioDB) {
      return {
        id: usuarioDB.id,
        nombre: usuarioDB.nombre,
        correo: usuarioDB.correo,
        password: "",
        esAdmin: usuarioDB.esAdmin,
        fotoPerfil: usuarioDB.fotoPerfil,
      };
    } else {
      // Insertamos usuario nuevo con datos de OAuth
      const { data: newUser, error: insertError } = await supabase
        .from("Usuarios")
        .insert([{
          auth_id: authUser.id,
          nombre: authUser.user_metadata?.full_name || authUser.email.split("@")[0],
          correo: authUser.email,
          esAdmin: false,
          fotoPerfil: authUser.user_metadata?.avatar_url || null,
        }])
        .select()
        .maybeSingle();

      if (insertError || !newUser) throw new Error(insertError?.message || "Error al crear usuario OAuth");

      return {
        id: newUser.id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        password: "",
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
