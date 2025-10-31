// src/paginas/Productos/MisProductos.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../context/UsuarioContext";
import { productoServices } from "../../services/producto.services";
import { deleteFile } from "../../services/storageService";
import type { IProducto } from "../../entidades/producto";
import Sidebar from "../../componentes/SideBar";
import Navbar from "../../componentes/NavBar";
import Footer from "../../componentes/footer";
import "../../assets/estilosProductos/mis_productos.css"

// 🔹 Función debounce (opcional para búsqueda futura)
function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<F>) => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const MisProductos: React.FC = () => {
  const navigate = useNavigate(); // Inicialización del hook useNavigate
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useUsuario();

  // 🔹 Cargar todos los productos del usuario autenticado
  useEffect(() => {
  if (usuario?.id) cargarProductos();
  }, [usuario]);

  const cargarProductos = async () => {
  try {
    setLoading(true);
    const data = await productoServices.ObtenerProductoPorUsuario(usuario!.id);
    setProductos(data || []);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  } finally {
    setLoading(false);
  }
  };
    
    // 🔹 Función para la navegación de edición
    const handleEditar = (id_producto: string) => {
        // Redirige a la ruta de edición: /editar-producto/:id_producto
        navigate(`/editar-producto/${id_producto}`);
    };

  // 🔹 Eliminar producto (imagen + registro)
  const eliminarProducto = async (producto: IProducto) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    // Eliminar imagen del Storage si existe
    if (producto.foto_producto) {
      try {
        const url = new URL(producto.foto_producto);
        const path = url.pathname.split("/storage/v1/object/public/ImagenesProductos/")[1];
        if (path) await deleteFile(path);
      } catch (err) {
        console.warn("No se pudo eliminar la imagen del storage:", err);
      }
    }

    // Eliminar producto de Supabase
    const eliminado = await productoServices.EliminarProducto(producto.id_producto);
    if (eliminado) {
      alert("✅ Producto eliminado correctamente");
      cargarProductos();
    } else {
      alert("❌ Error al eliminar el producto");
    }
  };

  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-main">
        <Navbar onSearch={() => {}} />

        <main className="misproductos-container">
          <div className="misproductos-header">
            <h2>📦 Mis Productos</h2>
          </div>

          {loading ? (
            <p className="misproductos-loading">Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p className="misproductos-empty">No has subido ningún producto todavía.</p>
          ) : (
            <div className="misproductos-grid">
              {productos.map((p) => (
                <div className="misproductos-card" key={p.id_producto}>
                  <img
                    src={p.foto_producto || "/img/default-product.png"}
                    alt={p.nombre_producto}
                  />
                  <div className="misproductos-info">
                    <h3>{p.nombre_producto}</h3>
                    <p>{p.descripcion_producto}</p>
                    <p className="misproductos-precio">${p.precio}</p>
                    <div className="misproductos-acciones">
                      {/* Botón Editar: Implementa la navegación a /editar-producto/:id_producto */}
                      <button 
                            className="btn-editar" 
                            onClick={() => handleEditar(p.id_producto)}
                        >
                            ✏️ Editar
                        </button>
                        
                      {/* Botón Eliminar: Llama a la función eliminarProducto */}
                      <button 
                            className="btn-eliminar" 
                            onClick={() => eliminarProducto(p)}
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MisProductos;
