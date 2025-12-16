// src/componentes/Categorias.tsx
import React, { useEffect, useState } from 'react';
import { CategoriaService } from '../services/categoria.service';
import type { ICategoria } from '../entidades/Categoria';
import { useIdioma } from '../context/IdiomasContext';
import '../assets/estilosComponentes/categorias.css';

interface Props {
  onSelectCategoria: (categoriaId: string | null) => void;
  categoriaSeleccionada?: string | null;
}

const Categorias: React.FC<Props> = ({ onSelectCategoria, categoriaSeleccionada }) => {
  const { translate } = useIdioma();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await CategoriaService.ObtenerCategoria();
        setCategorias(data || []);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarCategorias();
  }, []);

  if (loading) return <p>{translate('categories.loading')}</p>;
  if (categorias.length === 0) return <p>{translate('categories.empty')}</p>;

  return (
    <div className="categorias-grid">
      <div
        className={`categoria-card ${!categoriaSeleccionada ? 'seleccionada' : ''}`}
        onClick={() => onSelectCategoria(null)}
      >
        <h4>{translate('categories.all')}</h4>
      </div>
      {categorias.map((cat) => (
        <div
          key={cat.id_categoria}
          className={`categoria-card ${categoriaSeleccionada === cat.id_categoria ? 'seleccionada' : ''}`}
          onClick={() => onSelectCategoria(cat.id_categoria)}
        >
          <h4>{cat.nombre_categoria}</h4>
          <p>{cat.descripcion_categoria}</p>
        </div>
      ))}
    </div>
  );
};

export default Categorias;
