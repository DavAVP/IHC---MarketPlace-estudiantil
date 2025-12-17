import { supabase } from "../data/supabase.config";
import type { Comentario } from "../entidades/comentarios";
import type { IUsuario } from "../entidades/IUsuario";

type ComentarioInput = Omit<Comentario, "id">;

const TABLE = "comentarios";
const USERS_TABLE = "Usuarios";

export type ComentarioConAutor = Comentario & { usuario?: IUsuario | null };

const attachUsuarioInfo = async (comentarios: Comentario[]): Promise<ComentarioConAutor[]> => {
    if (!comentarios.length) return comentarios as ComentarioConAutor[];

    const userIds = Array.from(new Set(comentarios.map(coment => coment.usuarioId).filter(Boolean)));
    if (userIds.length === 0) return comentarios as ComentarioConAutor[];

    const { data: usuariosData, error: usuariosError } = await supabase
        .from(USERS_TABLE)
        .select("id, nombre, correo, esAdmin")
        .in("id", userIds);

    if (usuariosError) {
        console.error("Error al obtener usuarios para comentarios:", usuariosError.message);
        return comentarios as ComentarioConAutor[];
    }

    const usuariosMap = new Map<string, IUsuario>(
        (usuariosData ?? []).map(usuario => [
            usuario.id,
            {
                id: usuario.id,
                nombre: usuario.nombre ?? usuario.correo ?? "",
                correo: usuario.correo,
                esAdmin: usuario.esAdmin ?? undefined,
                fotoPerfil: (usuario as Partial<IUsuario>).fotoPerfil
            } satisfies IUsuario
        ])
    );

    return comentarios.map(comentario => ({
        ...comentario,
        usuario: usuariosMap.get(comentario.usuarioId) ?? null
    }));
};

export const ComentarioService = {
    async crearComentario(payload: ComentarioInput): Promise<ComentarioConAutor | null> {
        const { data, error } = await supabase
            .from(TABLE)
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error("Error al crear comentario:", error.message);
            return null;
        }

        const [comentarioConUsuario] = await attachUsuarioInfo([data as Comentario]);
        return comentarioConUsuario ?? (data as Comentario);
    },

    async obtenerComentarios(): Promise<ComentarioConAutor[]> {
        const { data, error } = await supabase
            .from(TABLE)
            .select("*");

        if (error) {
            console.error("Error al listar comentarios:", error.message);
            return [];
        }

        return attachUsuarioInfo((data ?? []) as Comentario[]);
    },

    async obtenerComentarioPorId(id: string): Promise<ComentarioConAutor | null> {
        const { data, error } = await supabase
            .from(TABLE)
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error al obtener comentario:", error.message);
            return null;
        }

        const [comentarioConUsuario] = await attachUsuarioInfo([data as Comentario]);
        return comentarioConUsuario ?? (data as Comentario);
    },

    async obtenerComentariosPorProducto(productoId: string): Promise<ComentarioConAutor[]> {
        const { data, error } = await supabase
            .from(TABLE)
            .select("*")
            .eq("productoId", productoId);

        if (error) {
            console.error("Error al obtener comentarios del producto:", error.message);
            return [];
        }

        return attachUsuarioInfo((data ?? []) as Comentario[]);
    },

    async actualizarComentario(id: string, payload: Partial<ComentarioInput>): Promise<ComentarioConAutor | null> {
        const { data, error } = await supabase
            .from(TABLE)
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error al actualizar comentario:", error.message);
            return null;
        }

        const [comentarioConUsuario] = await attachUsuarioInfo([data as Comentario]);
        return comentarioConUsuario ?? (data as Comentario);
    },

    async eliminarComentario(id: string): Promise<boolean> {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error al eliminar comentario:", error.message);
            return false;
        }

        return true;
    }
};
