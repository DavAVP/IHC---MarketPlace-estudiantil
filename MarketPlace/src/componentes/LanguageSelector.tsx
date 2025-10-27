import React from "react";
import { useIdioma } from "../context/IdiomasContext";

export const LanguageSelector: React.FC = () => {
    const { idioma, setIdioma } = useIdioma();
    return (
        <div className="flex gap-2">
            <button
                onClick={() => setIdioma("es")}
                disabled={idioma === "es"}
                className="px-3 py-1 rounded border disabled:opacity-50"
            >
                ES
            </button>
            <button
                onClick={() => setIdioma("en")}
                disabled={idioma === "en"}
                className="px-3 py-1 rounded border disabled:opacity-50"
            >
                EN
            </button>
        </div>
    );
};