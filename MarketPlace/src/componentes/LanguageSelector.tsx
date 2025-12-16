import React from "react";
import { useIdioma } from "../context/IdiomasContext";

export const LanguageSelector: React.FC = () => {
    const {
        idioma,
        setIdioma,
        translate,
        speakKey,
        cancelSpeak,
        speaking,
        speechSupported
    } = useIdioma();

    const handleLanguageChange = (lang: "es" | "en") => {
        setIdioma(lang);
    };

    const handleVoiceToggle = () => {
        if (!speechSupported) {
            alert(translate("common.voice.unsupported"));
            return;
        }

        if (speaking) {
            cancelSpeak();
            return;
        }

        speakKey("common.voice.intro");
    };

    const groupLabel = idioma === "es" ? "Selector de idioma" : "Language selector";

    return (
        <div className="language-selector" role="group" aria-label={groupLabel}>
            <button
                type="button"
                className="language-btn"
                onClick={() => handleLanguageChange("es")}
                aria-pressed={idioma === "es"}
                disabled={idioma === "es"}
            >
                ES
            </button>
            <button
                type="button"
                className={`language-btn language-btn--voice${speaking ? " language-btn--active" : ""}`}
                onClick={handleVoiceToggle}
                aria-pressed={speaking}
                aria-label={speaking ? translate("common.actions.stopReading") : translate("common.actions.readAloud")}
            >
                {speaking ? "■" : "🔊"}
            </button>
            <button
                type="button"
                className="language-btn"
                onClick={() => handleLanguageChange("en")}
                aria-pressed={idioma === "en"}
                disabled={idioma === "en"}
            >
                EN
            </button>
        </div>
    );
};