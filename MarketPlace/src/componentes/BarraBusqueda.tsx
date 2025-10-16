import React from "react";

interface IbarraBusqueda {
  onSearch: (query: string) => void;
}

const BarraBusqueda: React.FC<IbarraBusqueda> = ({ onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar productos, categorías..."
        onChange={(e) => onSearch(e.target.value)}
      />
      <button type="button">🔍</button>
    </div>
  );
};

export default BarraBusqueda;
