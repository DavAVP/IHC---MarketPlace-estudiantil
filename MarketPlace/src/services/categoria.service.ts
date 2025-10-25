import { supabase } from "../data/supabase.config";
import type { ICategoria } from "../entidades/Categoria";

export const CategoriaService = {
    async CrearCategoria(nombre_categoria: ICategoria): Promise<ICategoria | null>{
        const {data, error} = await supabase
        .from('Categoria')
        .insert([nombre_categoria])
        .select()
        .single()

        if(error){
            console.log('Error al crear una categoria', error.message)
            return null
        }
        return data as ICategoria
    },

    async ObtenerCategoria(): Promise<ICategoria[] | null>{
        const {data, error} = await supabase
        .from('Categoria')
        .select('*')

        if(error){
            console.log('Error al encontrar las categorias', error.message)
            return []
        }
        return data as ICategoria[]
    },

    async ObtenerCategoriaId(id_categoria: string): Promise<ICategoria | null>{
        const {data, error} = await supabase
        .from('Categoria')
        .select('*')
        .eq('id_categoria', id_categoria)
        .single()

        if(error){
            console.log('Error al encontrar la categoria', error.message)
            return null
        }
        return data as ICategoria
    },

    async ActualizarCategoria(id_categoria: string, categoria: Partial<ICategoria>): Promise<ICategoria | null>{
        const {data, error} = await supabase
        .from('Categoria')
        .update(categoria)
        .eq('id_cateogira', id_categoria)
        .select()
        .single()

        if (error){
            console.log('Error al actualizar categoria', error.message)
            return null
        }
        return data as ICategoria
    },

    async EliminarCategoria(id_categoria: string): Promise<boolean | null>{
        const {error} = await supabase
        .from('Categoria')
        .delete()
        .eq('id_categoria', id_categoria)


        if(error){
            console.log('Error al eliminar la categoria', error.message)
            return false
        }
        return true
    }
}