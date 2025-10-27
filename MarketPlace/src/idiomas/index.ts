import en from "./english/en.json";
import es from "./spanish/es.json";

export const idiomas = { en, es };
export type IdiomaKey = keyof typeof idiomas;
