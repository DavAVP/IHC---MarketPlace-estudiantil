import type { IProducto } from "../entidades/producto";
import { supabase } from "../data/supabase.config";

// crear producto
export const productoServices = {
    async crearProducto(producto: Omit<IProducto, 'id_producto' | 'Usuario_id'>): Promise<IProducto | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("No hay usuario logueado");
      return null;
    }
    const productoParaInsertar = {
      ...producto,
      Usuario_id: user.id, // UUID correcto del usuario
    };
    const { data, error } = await supabase
        .from('Producto')
        .insert([productoParaInsertar])
        .select()
        .single()

    if (error){
        console.log("No se puede subir producto: ", error.message)
        return null
    }
    return data as IProducto
    },
// Obtener todos los productos
    async ObtenerProductos(): Promise<IProducto[]>{
        const {data, error} = await supabase.from('Producto').select('*')

        if (error){
            console.log('Error al encontrar los productos', error.message)
            return []
        }
        return data as IProducto[]
    },
// Obtener producto por Id
    async ObtenerProductoId(id_producto: string): Promise<IProducto | null>{
        const {data, error } = await supabase
        .from('Producto')
        .select('*')
        .eq('id_producto', id_producto)
        .single()

        if(error){
            console.log('No se pudieron encontrar los productos', error.message)
            return null
        }
        return data as IProducto
    },
// Actualizar producto
    async ActualizarProducto (id_producto: string, producto: Partial<IProducto>): Promise<IProducto | null>{
        const {data, error } = await supabase
        .from('Producto')
        .update(producto)
        .eq('id_producto', id_producto)
        .select()
        .single()

        if (error){
            console.log('No se puede actualizar producto', error.message)
            return null
        }
        return data as IProducto
    },

    async EliminarProducto(id_producto: string): Promise<boolean>{
        const {error} = await supabase
        .from('Producto')
        .delete()
        .eq("id_producto", id_producto)

        if(error){
            console.log('Producto no se puedo eliminar', error.message)
            return false
        }
        return true
    },

    async ObtenerProductoPorUsuario(usuario_id: string): Promise<IProducto[]>{
        const {data, error} = await supabase.from('Producto').select('*').eq('Usuario_id', usuario_id)

        if(error){
            console.log('Producto no encontrar Producto por usuario', error.message)
            return []
        }
        return data as IProducto[]
    },

    async BuscarProductoCategoria(termino: string): Promise<IProducto[]>{
        const {data, error} = await supabase
        .from('Producto')
        .select('*')
        .or(`nombre_producto.ilike.%${termino}%, categoria_id.ilike.%${termino}%`)
        
        if(error){
            console.log('Error al encontrar producto', error.message)
            return []
        }
        return data as IProducto[]

    }





}

