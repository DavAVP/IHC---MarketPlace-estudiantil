import type { IProducto } from '../entidades/producto'

export const Productos: IProducto[] = [
  {
    id_producto: 1,
    Usuario_id: 1,
    categoria_id: 1,
    nombre_producto: 'Pulsera artesanal',
    precio: 5,
    descripcion_producto: 'Pulsera hecha a mano por estudiantes',
    ubicacion_producto: 'Campus A',
    fecha_Publicacion: '2025-10-10'
  },
  {
    id_producto: 2,
    Usuario_id: 2,
    categoria_id: 2,
    nombre_producto: 'Cuaderno personalizado',
    precio: 8,
    descripcion_producto: 'Cuaderno con diseños únicos',
    ubicacion_producto: 'Campus B',
    fecha_Publicacion: '2025-10-09'
  },
  {
    id_producto: 3,
    Usuario_id: 1,
    categoria_id: 1,
    nombre_producto: 'Collar de beads',
    precio: 10,
    descripcion_producto: 'Collar artesanal colorido',
    ubicacion_producto: 'Campus A',
    fecha_Publicacion: '2025-10-08'
  },
    {
    id_producto: 4,
    Usuario_id: 1,
    categoria_id: 1,
    nombre_producto: 'Collar',
    precio: 5,
    descripcion_producto: 'Collar artesanal',
    ubicacion_producto: 'Campus B',
    fecha_Publicacion: '2025-09-10'
  }
]
