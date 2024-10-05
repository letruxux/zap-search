import React, { useState, ReactNode } from "react";

interface HoverTooltipProps {
  tooltipText: string;
  children: ReactNode;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({ tooltipText, children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ position: "relative" }}
    >
      {children}
      {isHovering && (
        <div
          className="fixed bg-black bg-opacity-90 text-white px-2.5 py-1.5 rounded z-50"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y + 10,
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default HoverTooltip;
