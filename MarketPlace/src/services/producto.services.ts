import type { IProducto } from "../entidades/producto"; 
import { supabase } from "../data/supabase.config";

export const productoServices = {
    async crearProducto(
        producto: Omit<IProducto, 'id_producto' | 'Usuario_id'>, imagen?: File ): Promise<IProducto | null> {
        try {
            // Verificar sesión
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error("No hay usuario logueado:", userError);
                alert("Debes iniciar sesión para subir un producto");
                return null;
            }

            // Obtener ID de usuario desde la tabla Usuarios
            const { data: usuarioDB, error: usuarioError } = await supabase
                .from("Usuarios")
                .select("id")
                .eq("id", user.id)
                .maybeSingle();

            if (usuarioError || !usuarioDB) {
                console.error("Error al obtener usuario:", usuarioError);
                return null;
            }

            let fotoUrl: string | null = null;

            // Subir imagen si existe
            if (imagen) {
                console.log("Iniciando subida de imagen:", {
                    nombre: imagen.name,
                    tipo: imagen.type,
                    tamaño: imagen.size
                });

                const fileName = `${Date.now()}-${imagen.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const filePath = `productos/${usuarioDB.id}/${fileName}`;

                console.log("Intentando subir a:", {
                    bucket: 'ImagenesProductos',
                    ruta: filePath
                });

                const { error: uploadError } = await supabase
                    .storage
                    .from('ImagenesProductos')
                    .upload(filePath, imagen);

                if (uploadError) {
                    console.error("Error al subir imagen:", uploadError.message);
                    throw new Error(`Error al subir imagen: ${uploadError.message}`);
                }

                // Obtener URL pública
                const { data: publicUrlData } = supabase
                    .storage
                    .from('ImagenesProductos')
                    .getPublicUrl(filePath);

                fotoUrl = publicUrlData.publicUrl;
                console.log("URL pública generada:", fotoUrl);

            } else {
                console.log("No se recibió imagen para subir");
            }

            // Crear objeto del producto
            const productoParaInsertar = {
                ...producto,
                Usuario_id: usuarioDB.id,
                categoria_id: producto.categoria_id,
                feria_id: producto.feria_id || null,
                foto_producto: fotoUrl
            };

            console.log("Insertando producto:", productoParaInsertar);

            // Insertar en la base de datos
            const { data, error } = await supabase
                .from('Producto')
                .insert([productoParaInsertar])
                .select()
                .single();

            if (error) {
                throw new Error(`Error al insertar: ${error.message}`);
            }

            console.log("Producto creado exitosamente:", data);
            return data as IProducto;

        } catch (error) {
            console.error("Error en crearProducto:", error);
            alert(error instanceof Error ? error.message : "Error al crear producto");
            return null;
        }
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

    // Buscar productos por nombre o categoría
    async BuscarProductoCategoria(termino: string): Promise<IProducto[]> {
        const { data, error } = await supabase
            .from('Producto')
            .select('*')
            .or(`nombre_producto.ilike.%${termino}%, categoria_id.ilike.%${termino}%`);
        
        if (error) {
            console.log('Error al encontrar producto', error.message);
            return [];
        }
        return data as IProducto[];
    },

    async ObtenerProductosPorFeria(feriaId: string): Promise<IProducto[]> {
        const { data, error } = await supabase
            .from('Producto')
            .select('*')
            .eq('feria_id', feriaId);

        if (error) {
            console.error('Error al obtener productos por feria:', error.message);
            return [];
        }

        return (data ?? []) as IProducto[];
    }
};
