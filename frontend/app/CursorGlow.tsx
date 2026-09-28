import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";

export const CursorGlow: React.FC = () => {
  const { theme } = useTheme();
  const posRef = useRef({ x: -400, y: -400 });
  const smoothRef = useRef({ x: -400, y: -400 });
  const [smoothPos, setSmoothPos] = useState({ x: -400, y: -400 });
  const [visible, setVisible] = useState(false);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Smooth lerp animation loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      smoothRef.current = {
        x: lerp(smoothRef.current.x, posRef.current.x, 0.1),
        y: lerp(smoothRef.current.y, posRef.current.y, 0.1),
      };
      setSmoothPos({ ...smoothRef.current });
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [visible]);

  // Theme-based glow config
  const glow =
    theme === "bright"
      ? {
          // Vibrant light-green glow for bright mode
          inner: `radial-gradient(200px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(16,185,129,0.18), rgba(52,211,153,0.08) 45%, transparent 75%)`,
          outer: `radial-gradient(420px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(16,185,129,0.07), transparent 70%)`,
        }
      : theme === "mid"
      ? {
          inner: `radial-gradient(200px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(20,184,166,0.14), rgba(6,182,212,0.06) 45%, transparent 75%)`,
          outer: `radial-gradient(400px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(20,184,166,0.05), transparent 70%)`,
        }
      : {
          // Subtle emerald for dark mode
          inner: `radial-gradient(200px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(16,185,129,0.07), rgba(6,182,212,0.03) 45%, transparent 75%)`,
          outer: `radial-gradient(400px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(16,185,129,0.025), transparent 70%)`,
        };

  return (
    <>
      {/* Outer soft ambient halo */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: glow.outer }}
      />
      {/* Inner bright spot */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: glow.inner }}
      />
    </>
  );
};

export default CursorGlow;