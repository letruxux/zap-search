import React, { useState, ReactNode } from "react";

interface HoverTooltipProps {
  tooltipText: string | ReactNode;
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
          className="fixed flex justify-center bg-black bg-opacity-90 text-white px-2.5 py-1.5 rounded-lg z-50 break-normal"
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
