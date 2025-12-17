export interface Comentario{
    id: string;
    descripcion: string;
    calificacion: number;
    usuarioId: string;
    productoId: string;
    parentId?: string | null;
    created_at?: string | null;
}