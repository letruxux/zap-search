import React, { useState } from "react";
import clsx from "clsx";

// Props interface
interface ImageWithPopupProps {
  src: string;
  alt?: string;
}

const ImageWithPopup: React.FC<ImageWithPopupProps> = ({ src, alt = "Image" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle image load
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div
          className="bg-base-100 animate-pulse size-16 rounded-lg"
          style={{ height: "4rem", width: "auto" }}
        ></div>
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        className={clsx("size-16 transition-opacity opacity-0 rounded", {
          "opacity-100": isLoaded,
        })}
        onLoad={handleImageLoaded}
      />

      {/* Popup Image on Hover */}
      <div
        className={clsx(
          "fixed z-50 bg-base-100 rounded shadow-lg w-[50vh]",
          "transition-all duration-300 ease-in-out",
          "left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%]",
          {
            "opacity-0 scale-95 pointer-events-none": !isHovered,
            "opacity-100 scale-100": isHovered,
          }
        )}
      >
        <img src={src} alt={alt} className="w-full" />
      </div>
    </div>
  );
};

export default ImageWithPopup;
