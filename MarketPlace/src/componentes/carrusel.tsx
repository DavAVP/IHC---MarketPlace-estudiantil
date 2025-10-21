/* Componentes/carrusel.tsx */
import React, { useState, useEffect } from "react";
import "../assets/estilos.css";

interface ICarrusel {
  // slides pueden ser URLs (string) o JSX (React.ReactNode) para ferias
  slides: Array<string | React.ReactNode>;
  interval?: number;
  className?: string;
}

const Carrusel: React.FC<ICarrusel> = ({ slides, interval = 5000, className }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides, interval]);

  // si no hay slides, render vacío
  if (!slides || slides.length === 0) {
    return null;
  }

  const goTo = (index: number) => setCurrent(index);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className={carrusel ${className ?? ""}}>
      {/* Track con slides (imagen o JSX) */}
      <div
        className="carrusel-track"
        style={{ transform: translateX(-${current * 100}%) }}
      >
        {slides.map((slide, index) => (
          <div className="carrusel-slide" key={index}>
            {typeof slide === "string" ? (
              <img src={slide} alt={slide-${index}} />
            ) : (
              // Si es JSX, lo renderizamos dentro del slide
              <div className="carrusel-slide-content" style={{ height: "100%", width: "100%" }}>
                {slide}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button className="carrusel-btn prev" onClick={prevSlide} aria-label="Anterior">
        ❮
      </button>
      <button className="carrusel-btn next" onClick={nextSlide} aria-label="Siguiente">
        ❯
      </button>

      {/* Dots de control */}
      <div className="carrusel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={dot ${index === current ? "active" : ""}}
            onClick={() => goTo(index)}
            aria-label={Ir a slide ${index + 1}}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;