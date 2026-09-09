import React, { useEffect, useState } from "react";

export const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: -300, y: -300 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [visible]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-40 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: `radial-gradient(240px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.025), rgba(6, 182, 212, 0.01) 50%, transparent 80%)`,
      }}
    />
  );
};

export default CursorGlow;