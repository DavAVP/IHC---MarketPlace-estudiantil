import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode
} from "react";
import { idiomas, type IdiomaKey } from "../idiomas";

type IdiomaContextType = {
    idioma: IdiomaKey;
    setIdioma: (lang: IdiomaKey) => void;
    t: typeof idiomas["es"];
    translate: (key: string, fallback?: string) => string;
    speak: (text: string, options?: { lang?: IdiomaKey }) => void;
    speakKey: (key: string, fallback?: string) => void;
    cancelSpeak: () => void;
    speaking: boolean;
    speechSupported: boolean;
};

const DEFAULT_LANG: IdiomaKey = "es";

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

const getNestedValue = (obj: Record<string, any>, path: string[]): unknown => {
    return path.reduce<unknown>((acc, segment) => {
        if (acc && typeof acc === "object" && segment in acc) {
            return (acc as Record<string, unknown>)[segment];
        }
        return undefined;
    }, obj);
};

export const IdiomaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [idioma, setIdiomaState] = useState<IdiomaKey>(DEFAULT_LANG);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
    const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (!speechSupported) return;
        speechSynthesisRef.current = window.speechSynthesis;

        const synth = speechSynthesisRef.current;
        const handleVoices = () => {
            const available = synth?.getVoices() ?? [];
            setVoices(available);
        };

        handleVoices();
        synth?.addEventListener("voiceschanged", handleVoices);

        return () => synth?.removeEventListener("voiceschanged", handleVoices);
    }, [speechSupported]);

    useEffect(() => {
        const lang = localStorage.getItem("idioma") as IdiomaKey | null;
        if (lang && idiomas[lang]) {
            setIdiomaState(lang);
        }
    }, []);

    const setIdioma = (lang: IdiomaKey) => {
        setIdiomaState(lang);
        localStorage.setItem("idioma", lang);
    };

    const t = useMemo(() => idiomas[idioma], [idioma]);

    const translate = useMemo(() => {
        return (key: string, fallback?: string) => {
            if (!key) return fallback ?? "";

            const path = key.split(".");
            const value = getNestedValue(t, path);
            if (typeof value === "string") {
                return value;
            }

            const defaultValue = getNestedValue(idiomas[DEFAULT_LANG], path);
            if (typeof defaultValue === "string") {
                return defaultValue;
            }

            return fallback ?? key;
        };
    }, [t]);

    const cancelSpeak = useCallback(() => {
        if (!speechSupported || !speechSynthesisRef.current) return;
        speechSynthesisRef.current.cancel();
        setSpeaking(false);
    }, [speechSupported]);

    const resolveVoiceForLang = useCallback(
        (lang: IdiomaKey) => {
            if (!voices.length) return null;
            const preferred = lang === "en" ? "en" : "es";
            const exactMatch = voices.find(voice => voice.lang.toLowerCase().startsWith(preferred));
            if (exactMatch) return exactMatch;
            const fallback = voices.find(voice => voice.lang.toLowerCase().startsWith("en"));
            return fallback ?? voices[0] ?? null;
        },
        [voices]
    );

    const speak = useCallback(
        (text: string, options?: { lang?: IdiomaKey }) => {
            if (!speechSupported || !speechSynthesisRef.current) {
                console.warn("Speech synthesis not supported in this browser.");
                return;
            }

            const trimmed = text?.trim();
            if (!trimmed) return;

            const synth = speechSynthesisRef.current;
            cancelSpeak();

            const langKey = options?.lang ?? idioma;
            const utterance = new SpeechSynthesisUtterance(trimmed);
            const selectedVoice = resolveVoiceForLang(langKey);

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
            } else {
                utterance.lang = langKey === "en" ? "en-US" : "es-ES";
            }

            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);

            setSpeaking(true);
            synth.speak(utterance);
        },
        [cancelSpeak, idioma, resolveVoiceForLang, speechSupported]
    );

    const speakKey = useCallback(
        (key: string, fallback?: string) => {
            const message = translate(key, fallback);
            speak(message);
        },
        [speak, translate]
    );

    return (
        <IdiomaContext.Provider
            value={{
                idioma,
                setIdioma,
                t,
                translate,
                speak,
                speakKey,
                cancelSpeak,
                speaking,
                speechSupported
            }}
        >
            {children}
        </IdiomaContext.Provider>
    );
};

export const useIdioma = () => {
    const context = useContext(IdiomaContext);
    if (!context) throw new Error("useIdioma debe usarse dentro de un IdiomaProvider");
    return context;
};
