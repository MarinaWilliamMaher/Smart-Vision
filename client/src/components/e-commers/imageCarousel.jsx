import React, { useEffect, useState } from "react";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "sofa.jpeg",
    "kitchen.jpg",
    "beds.avif",
    "kitchen.jpg",
    "sofa.jpeg",
    "sofa.jpeg",
  ];
  const [moveLeft, setMoveLeft] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!hoveredIndex) {
        setMoveLeft(true);

        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          setMoveLeft(false);
        }, 500); 
      }
    }, 500); 

    return () => clearInterval(intervalId);
  }, [hoveredIndex, images.length]);

  const imageStyles = [
    { width: "14%", height: "100px" },
    { width: "22%", height: "150px" },
    { width: "28%", height: "34vh" },
    { width: "22%", height: "150px" },
    { width: "14%", height: "100px" },
  ];

  const updatedImages = [
    images[(currentIndex - 2 + images.length) % images.length],
    images[(currentIndex - 1 + images.length) % images.length],
    images[currentIndex],
    images[(currentIndex + 1) % images.length],
    images[(currentIndex + 2) % images.length],
  ];

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      className="image-carousel-container"
      style={{
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      {updatedImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index}`}
          style={{
            ...imageStyles[index],
            // transition: "transform 0.5s",
            // transform: moveLeft && image === "beds.avif" ? "translateX(-10px)" : "none"
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
