// src/paginas/Productos/EditarProducto.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productoServices } from "../../services/producto.services";
import { CategoriaService } from "../../services/categoria.service"; // Importado
import { FeriaService } from "../../services/feria.service"; // Importado
import type { IProducto } from "../../entidades/producto";
import type { ICategoria } from "../../entidades/Categoria"; // Importado
import type { IFeria } from "../../entidades/Feria"; // Importado
import { uploadFile, deleteFile } from "../../services/storageService";
import Sidebar from "../../componentes/SideBar";
import Navbar from "../../componentes/NavBar";
import Footer from "../../componentes/footer";
import { useIdioma } from "../../context/IdiomasContext";
import "../../assets/estilosProductos/editarProductos.css"

const EditarProducto: React.FC = () => {
  const { id_producto } = useParams<{ id_producto?: string }>();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<IProducto | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | string>("");
  const [categoria, setCategoria] = useState("");
  const [feria, setFeria] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const { translate } = useIdioma();

  // --- NUEVO: Estados para las listas ---
  const [listaCategorias, setListaCategorias] = useState<ICategoria[]>([]);
  const [listaFerias, setListaFerias] = useState<IFeria[]>([]);

  // 🔹 Cargar datos del producto actual
  useEffect(() => {
    const cargarProducto = async () => {
      if (!id_producto) return;
      setLoading(true);
      const data = await productoServices.ObtenerProductoId(id_producto);
      if (data) {
        setProducto(data);
        setNombre(data.nombre_producto);
        setDescripcion(data.descripcion_producto);
        setPrecio(data.precio);
        setCategoria(data.categoria_id || "");
        setFeria(data.feria_id || "");
        setPreview(data.foto_producto || null);
      }
      setLoading(false);
    };
    cargarProducto();
  }, [id_producto]);

  // --- NUEVO: Cargar listas de Categorías y Ferias al montar ---
  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [categoriasData, feriasData] = await Promise.all([
          CategoriaService.ObtenerCategoria(),
          FeriaService.ObtenerFerias()
        ]);
        setListaCategorias(categoriasData);
        setListaFerias(feriasData);
      } catch (error) {
        console.error("Error al cargar listas:", error);
      }
    };
    cargarListas();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // 🔹 Manejar imagen seleccionada
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Guardar cambios
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto) return;
    setGuardando(true);

    try {
      let fotoUrl = producto.foto_producto;

      // Si el usuario sube una nueva imagen
      if (imagen) {
        // Si el producto ya tenía imagen, la borramos
        if (producto.foto_producto) {
          const url = new URL(producto.foto_producto);
          // La lógica para obtener la ruta de la imagen en el storage
          const oldPath = url.pathname.split("/storage/v1/object/public/ImagenesProductos/")[1];
          if (oldPath) await deleteFile(oldPath);
        }

        const filePath = `productos/${producto.Usuario_id}/${Date.now()}-${imagen.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const subida = await uploadFile(imagen, "ImagenesProductos", filePath);

        if ("error" in subida) {
          console.error("Error al subir la imagen:", subida.error.message);
          setGuardando(false);
          return;
        }

        fotoUrl = subida.publicUrl;
      }

      const productoActualizado: Partial<IProducto> = {
        nombre_producto: nombre,
        descripcion_producto: descripcion,
        precio: Number(precio),
        // La lógica de '|| null' sigue siendo correcta
        categoria_id: categoria || undefined,
        feria_id: feria || undefined,
        foto_producto: fotoUrl,
      };

      const actualizado = await productoServices.ActualizarProducto(
        producto.id_producto,
        productoActualizado
      );

      if (actualizado) {
        console.log("✅ Producto actualizado correctamente");
        navigate("/home");
      } else {
        console.error("❌ Error al actualizar el producto");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-600">{translate('productDetail.loading')}</div>;
  }

  if (!producto) {
    return <div className="flex items-center justify-center h-screen text-gray-600">{translate('messages.productNotFound')}</div>;
  }

  return (
    <div className="editar-producto-page">
      <Sidebar />
      <div className="flex-1" style={{ flex: 1 }}>
        <Navbar onSearch={() => {}} />
        <div className="p-8">

          <h1>{translate('editProduct.title')}</h1>

          <form onSubmit={handleGuardar}>

            <div>
              <label>{translate('editProduct.image')}</label>
              {preview && <img src={preview} alt="Vista previa" style={{ width: '192px', height: '192px', marginBottom: '10px' }} />}
              <input type="file" accept="image/*" onChange={handleImagen} />
            </div>

            <div>
              <label>{translate('editProduct.name')}</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div>
              <label>{translate('editProduct.description')}</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows={4}
              ></textarea>
            </div>

            <div>
              <label>{translate('editProduct.price')}</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>

            {/* --- CAMBIO: Input a Select para Categoría --- */}
            <div>
              <label>{translate('editProduct.category')}</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">{translate('editProduct.categoryPlaceholder')}</option>
                {listaCategorias.map((cat) => (
                  // Asumiendo que la entidad ICategoria tiene 'id_categoria' y 'nombre_categoria'
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* --- CAMBIO: Input a Select para Feria --- */}
            <div>
              <label>{translate('editProduct.fair')}</label>
              <select
                value={feria}
                onChange={(e) => setFeria(e.target.value)}
              >
                <option value="">{translate('editProduct.fairPlaceholder')}</option>
                {listaFerias.map((f) => (
                   // Asumiendo que la entidad IFeria tiene 'id_feria' y 'nombre_feria'
                  <option key={f.id_feria} value={f.id_feria}>
                    {f.nombre_feria}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={guardando}
            >
              {guardando ? translate('editProduct.saving') : translate('editProduct.save')}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditarProducto;

