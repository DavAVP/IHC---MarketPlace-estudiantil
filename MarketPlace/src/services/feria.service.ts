import { supabase } from "../data/supabase.config";
import type { IFeria } from "../entidades/Feria";

export const FeriaService = {
    async CrearFeria(nombre_feria: Omit<IFeria, 'id_feria'>): Promise<IFeria | null>{
        const {data, error} = await supabase
        .from('Feria')
        .insert([nombre_feria])
        .select()
        .single()

        if(error){
            console.log('Error al crear la feria', error.message)
            return null
        }
        return data as IFeria
    },

    async ObtenerFerias(): Promise<IFeria[] | null>{
        const{data, error} = await supabase
        .from('Feria')
        .select('*')

        if(error){
            console.log('Error al encontrar todas las ferias', error.message)
            return []
        }
        return data as IFeria[]
    },

    async ObtenerFeriasID(id_feria: string): Promise<IFeria | null>{
        const {data, error } = await supabase
        .from('Feria')
        .select('*')
        .eq('id_feria', id_feria)
        .single()

        if(error){
            console.log('Error al encontrar la feria ', error.message)
            return null
        }
        return data as IFeria
    },

    async ActualizarFeria(id_feria: string, feria: Partial<IFeria>): Promise<IFeria | null>{
        const {data, error} = await supabase
        .from('Feria')
        .update(feria)
        .eq('id_feria', id_feria)
        .select()
        .single()

        if(error){
            console.log('Error al actualizar la feria', error.message)
            return null
        }
        return data as IFeria
    },

    async EliminarFeria(id_feria: string): Promise<Boolean | null>{
        const {error} = await supabase
        .from('Feria')
        .delete()
        .eq('id_feria', id_feria)

        if(error){
            console.log('Error al eliminar feria', error.message)
            return false
        }
        return true
    }



}
