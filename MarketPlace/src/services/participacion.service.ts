import { supabase } from "../data/supabase.config";
import type { Participacion } from "../entidades/participacion";

const TABLE = "Participacion";

type ParticipacionInput = Omit<Participacion, "id">;

const normalizePayload = (feriaId: string, usuarioId: string): ParticipacionInput => ({
    usuarioId,
    feriaID: feriaId
});

const obtenerParticipacion = async (feriaId: string, usuarioId: string): Promise<Participacion | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("feriaID", feriaId)
        .eq("usuarioId", usuarioId)
        .maybeSingle();

    if (error) {
        console.error("Error al validar participación:", error.message);
        return null;
    }

    return (data as Participacion) ?? null;
};

const registrarParticipacion = async (feriaId: string, usuarioId: string): Promise<Participacion | null> => {
    const existing = await obtenerParticipacion(feriaId, usuarioId);
    if (existing) return existing;

    const { data, error } = await supabase
        .from(TABLE)
        .insert([normalizePayload(feriaId, usuarioId)])
        .select()
        .single();

    if (error) {
        console.error("Error al registrar participación:", error.message);
        return null;
    }

    return data as Participacion;
};

const obtenerParticipacionesPorUsuario = async (usuarioId: string): Promise<Participacion[]> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("usuarioId", usuarioId);

    if (error) {
        console.error("Error al obtener participaciones del usuario:", error.message);
        return [];
    }

    return (data ?? []) as Participacion[];
};

export const ParticipacionService = {
    registrarParticipacion,
    obtenerParticipacion,
    obtenerParticipacionesPorUsuario
};
