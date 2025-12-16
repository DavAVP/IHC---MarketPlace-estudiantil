import { supabase } from "../data/supabase.config";
import type { IProducto } from "../entidades/producto";

export const CarritoService = {
  async agregarProducto(
    producto: IProducto,
    usuarioId: string,
    cantidad: number = 1
  ) {
    if (!usuarioId) throw new Error("Falta usuario");

    // Ver si ya existe en el carrito para actualizar cantidad
    const { data: existing, error: fetchError } = await supabase
      .from("Carrito")
      .select("id, cantidad")
      .eq("usuario_id", usuarioId)
      .eq("id_producto", producto.id_producto)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      const { error: updateError } = await supabase
        .from("Carrito")
        .update({ cantidad: (existing.cantidad ?? 0) + cantidad })
        .eq("id", existing.id);
      if (updateError) throw updateError;
      return true;
    }

    const payload = {
      usuario_id: usuarioId,
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      cantidad
    };

    const { error } = await supabase.from("Carrito").insert(payload);
    if (error) throw error;
    return true;
  },

  async obtenerPorUsuario(usuarioId: string) {
    if (!usuarioId) return [];
    const { data, error } = await supabase
      .from("Carrito")
      .select("id, id_producto, nombre_producto, precio, cantidad")
      .eq("usuario_id", usuarioId);

    if (error) throw error;
    return data ?? [];
  },

  async eliminar(itemId: string) {
    if (!itemId) throw new Error("Falta item a eliminar");
    const { error } = await supabase.from("Carrito").delete().eq("id", itemId);
    if (error) throw error;
    return true;
  },

  async actualizarCantidad(itemId: string, cantidad: number) {
    if (!itemId) throw new Error("Falta item a actualizar");
    if (cantidad < 1) throw new Error("Cantidad inválida");
    const { error } = await supabase
      .from("Carrito")
      .update({ cantidad })
      .eq("id", itemId);
    if (error) throw error;
    return true;
  }
};
