export interface IProducto{
    id_producto: number
    Usuario_id: number
    categoria_id: number
    nombre_producto: string
    precio: number
    descripcion_producto: string
    foto_producto?: string
    ubicacion_producto: string
    fecha_Publicacion: string
}