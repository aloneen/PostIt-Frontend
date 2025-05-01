import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './css/ImageCarousel.css';

export default function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className="carousel">
      <img
        src={images[idx].url}
        alt=""
        className="carousel__image"
      />

      {images.length > 1 && (
        <>
          <button className="carousel__arrow carousel__arrow--left" onClick={prev}>
            <FaChevronLeft />
          </button>
          <button className="carousel__arrow carousel__arrow--right" onClick={next}>
            <FaChevronRight />
          </button>
          <div className="carousel__dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`carousel__dot ${i === idx ? 'active' : ''}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
