import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { idiomas, type IdiomaKey } from "../idiomas";

    type IdiomaContextType = {
    idioma: IdiomaKey;
    setIdioma: (lang: IdiomaKey) => void;
    t: typeof idiomas["es"]; // Traducciones disponibles
    };

    const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

    export const IdiomaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [idioma, setIdiomaState] = useState<IdiomaKey>("es");

    // Cargar idioma guardado en localStorage
    useEffect(() => {
        const lang = localStorage.getItem("idioma") as IdiomaKey | null;
        if (lang && idiomas[lang]) {
        setIdiomaState(lang);
        }
    }, []);

    // Guardar idioma cuando cambia
    const setIdioma = (lang: IdiomaKey) => {
        setIdiomaState(lang);
        localStorage.setItem("idioma", lang);
    };

    const t = idiomas[idioma];

    return (
        <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>
        {children}
        </IdiomaContext.Provider>
    );
    };

    export const useIdioma = () => {
    const context = useContext(IdiomaContext);
    if (!context) throw new Error("useIdioma debe usarse dentro de un IdiomaProvider");
    return context;
    };
