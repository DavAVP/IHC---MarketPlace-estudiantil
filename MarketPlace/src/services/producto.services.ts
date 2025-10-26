import type { IProducto } from "../entidades/producto";
import { supabase } from "../data/supabase.config";

// crear producto
export const productoServices = {
    async crearProducto(
    producto: Omit<IProducto, 'id_producto' | 'Usuario_id'>
    ): Promise<IProducto | null> {
    // Obtener el usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("No hay usuario logueado");
        alert("Debes iniciar sesión para subir un producto");
        return null;
    }

    // Buscar el id real de la tabla Usuarios usando el auth_id
    const { data: usuarioDB, error: usuarioError } = await supabase
        .from("Usuarios")
        .select("id")
        .eq("auth_id", user.id)
        .maybeSingle();

    if (usuarioError || !usuarioDB) {
        console.error("Usuario no encontrado en la base de datos");
        alert("Error: Usuario no registrado");
        return null;
    }

    // Preparar el producto para insertar
    const productoParaInsertar = {
        ...producto,
        Usuario_id: usuarioDB.id, // <-- id correcto
        categoria_id: producto.categoria_id,
        feria_id: producto.feria_id || null, // opcional
    };

    // Insertar producto
    const { data, error } = await supabase
        .from('Producto')
        .insert([productoParaInsertar])
        .select()
        .single();

    if (error) {
        console.error("No se puede subir producto:", error.message);
        alert("Error al subir producto: " + error.message);
        return null;
    }

    return data as IProducto;
    },


    // Obtener todos los productos
    async ObtenerProductos(): Promise<IProducto[]> {
        const { data, error } = await supabase.from('Producto').select('*');
        if (error) {
        console.error('Error al obtener productos:', error.message);
        return [];
        }
        return data as IProducto[];
    },

    // Obtener producto por Id
    async ObtenerProductoId(id_producto: string): Promise<IProducto | null> {
        const { data, error } = await supabase
        .from('Producto')
        .select('*')
        .eq('id_producto', id_producto)
        .single();
        if (error) {
        console.error('Error al obtener producto:', error.message);
        return null;
        }
        return data as IProducto;
    },

    // Actualizar producto
    async ActualizarProducto(id_producto: string, producto: Partial<IProducto>): Promise<IProducto | null> {
        const { data, error } = await supabase
        .from('Producto')
        .update(producto)
        .eq('id_producto', id_producto)
        .select()
        .single();
        if (error) {
        console.error('Error al actualizar producto:', error.message);
        return null;
        }
        return data as IProducto;
    },

    // Eliminar producto
    async EliminarProducto(id_producto: string): Promise<boolean> {
        const { error } = await supabase
        .from('Producto')
        .delete()
        .eq("id_producto", id_producto);
        if (error) {
        console.error('Error al eliminar producto:', error.message);
        return false;
        }
        return true;
    },

    // Obtener productos por usuario
    async ObtenerProductoPorUsuario(usuario_id: string): Promise<IProducto[]> {
        const { data, error } = await supabase
        .from('Producto')
        .select('*')
        .eq('Usuario_id', usuario_id);
        if (error) {
        console.error('Error al obtener productos por usuario:', error.message);
        return [];
        }
        return data as IProducto[];
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

