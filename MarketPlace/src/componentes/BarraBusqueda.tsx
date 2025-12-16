import React from "react";
import { useIdioma } from "../context/IdiomasContext";

interface IbarraBusqueda {
  onSearch: (query: string) => void;
}

const BarraBusqueda: React.FC<IbarraBusqueda> = ({ onSearch }) => {
  const { translate } = useIdioma();

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={translate("common.searchPlaceholder")}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button type="button" aria-label={translate("common.searchPlaceholder")}>🔍</button>
    </div>
  );
};

export default BarraBusqueda;
