import { supabase } from "../data/supabase.config";
import type { IUsuario } from "../entidades/IUsuario";

export const UsuarioServices = {
    async CrearUsuario(usuario: IUsuario): Promise<IUsuario | null>{
        const {data, error} = await supabase.from('Usuarios').insert([usuario]).select().single()

        if (error){
            console.log('Error al crear el usuario', error.message)
            return null
        }
        return data as IUsuario
    },

    async ObtenerUsuarios(): Promise<IUsuario[] | null>{
        const {data, error} = await supabase
        .from('Usuarios')
        .select('*')
        
        if(error){
            console.log('Error al encontrar todos los usuarios', error.message)
            return []
        }
        return data as IUsuario[]
    },

    async ObtenerUsuarioId(id: string): Promise<IUsuario | null>{
        const {data, error} = await supabase 
        .from('Usuarios')
        .select('*')
        .eq('id', id)
        .single()

        if(error){
            console.log('Error al encontrar al usuario', error.message)
            return null
        }
        return data as IUsuario
    },

    async ActualizarUsuario(id: string, usuario: Partial<IUsuario>): Promise<IUsuario | null>{
        const {data, error} = await supabase
        .from('Usuarios')
        .update(usuario)
        .eq('id', id)
        .select()

        if(error){
            console.log('Error al actualizar usuario', error.message)
            return null
        }
        return data && data.length > 0 ? data[0] as IUsuario : null;
    },

    async EliminarUsuario(id: string): Promise<boolean>{
        const {error} = await supabase
        .from('Usuarios')
        .delete()
        .eq('id', id)

        if(error){
            console.log('Error al actualizar usuario', error.message)
            return false
        }
        return true

    }


}