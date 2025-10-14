/* Componentes/carrusel.tsx */
import React, { useState, useEffect } from "react";
import "../assets/estilos.css";

interface ICarrusel {
  images: string[];
  interval?: number;
}

const Carrusel: React.FC<ICarrusel> = ({ images, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  const goTo = (index: number) => setCurrent(index);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="carrusel">
      {/* Track con imágenes */}
      <div
        className="carrusel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="carrusel-slide" key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button className="carrusel-btn prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="carrusel-btn next" onClick={nextSlide}>
        ❯
      </button>

      {/* Dots de control */}
      <div className="carrusel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goTo(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;
