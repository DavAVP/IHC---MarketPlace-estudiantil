import React, { useState } from "react";

interface IbarraBusqueda {
  onSearch: (query: string) => void;
}

const BarraBusqueda: React.FC<IbarraBusqueda> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar productos, categorías..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
};

export default BarraBusqueda;
