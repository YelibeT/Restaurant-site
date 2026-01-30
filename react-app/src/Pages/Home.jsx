import React, { useState, useEffect } from "react";

export default function Home() {
  const [activeItem, setActiveItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages = [
    "/images/hero1.avif",
    "/images/hero2.jpg",
    "/images/hero3.jpg"
  ];

  const specials = [
    {
      id: 1,
      name: "Dirikosh Firfir",
      image: "/images/ድርቆሽፍ.jpg",
      description: "Traditional Ethiopian firfir made from dried injera."
    },
    {
      id: 2,
      name: "Special Kitifo",
      image: "/images/ክትፎ.jpg",
      description: "Finely minced raw beef seasoned with spices and butter."
    },
    {
      id: 3,
      name: "Awaze Tibis",
      image: "/images/አዋዜጥብስ.jpeg",
      description: "Sautéed beef cubes cooked with awaze sauce."
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  // Optional: Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="animate-fade">
      {/* SINGLE HERO SECTION WITH SLIDER */}
      <section id="Home" className="hero">
        <div 
          className="intro" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImages[currentIndex]})`,
            transition: 'background-image 0.8s ease-in-out'
          }}
        >
          <button className="slider-btn left" onClick={prevSlide}>&#10094;</button>
          
          <div className="text-content">
            <h1 key={`h1-${currentIndex}`} className="slide-text">Abyssinia Restaurant</h1>
            <h2 key={`h2-${currentIndex}`} className="slide-text delay">Authentic Taste of Ethiopian Cuisine</h2>
          </div>

          <button className="slider-btn right" onClick={nextSlide}>&#10095;</button>
        </div>
      </section>

      {/* SPECIALS */}
      <section className="services">
        <h3>Chef's Specialities</h3>
        <div className="specials">
          {specials.map((item) => (
            <div
              key={item.id}
              className="food"
              onClick={() => setActiveItem(item)}
            >
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* POPUP */}
      {activeItem && (
        <div className="popup" onClick={() => setActiveItem(null)}>
          <div className="popup-window" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setActiveItem(null)}>&times;</button>
            <img src={activeItem.image} alt={activeItem.name} />
            <h4>{activeItem.name}</h4>
            <p>{activeItem.description}</p>
            <button id="popup-btn">Order</button>
          </div>
        </div>
      )}
    </div>
  );
}