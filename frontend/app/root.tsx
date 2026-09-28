import "./app.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { CursorGlow } from "./CursorGlow";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { motion } from "framer-motion";
import WellnessAssistant from "./components/WellnessAssistant";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
  },
];

// ─── Bright-mode floating particle shapes ───────────────────────────────────
const BRIGHT_PARTICLES = [
  // Leaf-like hexagon - top left
  { id: "hex1", x: "8%",  y: "12%", size: 48, delay: 0,    duration: 20, shape: "hex",     color: "rgba(16,185,129,0.22)" },
  // Floating ring - top right
  { id: "ring1", x: "85%", y: "8%",  size: 56, delay: 2.5,  duration: 18, shape: "ring",    color: "rgba(52,211,153,0.28)" },
  // Small dot cluster - mid left
  { id: "dot1",  x: "5%",  y: "52%", size: 10, delay: 1.2,  duration: 14, shape: "dot",     color: "rgba(16,185,129,0.45)" },
  { id: "dot2",  x: "7%",  y: "56%", size: 7,  delay: 1.8,  duration: 14, shape: "dot",     color: "rgba(52,211,153,0.35)" },
  { id: "dot3",  x: "3%",  y: "59%", size: 5,  delay: 2.2,  duration: 14, shape: "dot",     color: "rgba(16,185,129,0.30)" },
  // Diamond - mid right
  { id: "dia1",  x: "91%", y: "42%", size: 32, delay: 0.8,  duration: 22, shape: "diamond", color: "rgba(20,184,166,0.25)" },
  // Cross/plus - bottom left
  { id: "cross", x: "14%", y: "78%", size: 28, delay: 3,    duration: 16, shape: "cross",   color: "rgba(16,185,129,0.30)" },
  // Rounded triangle - bottom right
  { id: "tri1",  x: "78%", y: "82%", size: 40, delay: 1.5,  duration: 19, shape: "triangle",color: "rgba(52,211,153,0.22)" },
  // Dashed circle - center right
  { id: "circ1", x: "93%", y: "68%", size: 38, delay: 4,    duration: 24, shape: "circle",  color: "rgba(16,185,129,0.20)" },
  // Tiny sparkle dots scattered
  { id: "sp1",   x: "22%", y: "22%", size: 6,  delay: 0.5,  duration: 10, shape: "dot",     color: "rgba(16,185,129,0.60)" },
  { id: "sp2",   x: "60%", y: "15%", size: 5,  delay: 1.1,  duration: 12, shape: "dot",     color: "rgba(52,211,153,0.55)" },
  { id: "sp3",   x: "42%", y: "88%", size: 7,  delay: 2.8,  duration: 11, shape: "dot",     color: "rgba(16,185,129,0.50)" },
  { id: "sp4",   x: "75%", y: "55%", size: 5,  delay: 3.5,  duration: 13, shape: "dot",     color: "rgba(20,184,166,0.55)" },
  // Leaf shape - upper center
  { id: "ring2", x: "48%", y: "5%",  size: 44, delay: 1.8,  duration: 26, shape: "ring",    color: "rgba(16,185,129,0.15)" },
  // Bottom center diamond
  { id: "dia2",  x: "50%", y: "92%", size: 24, delay: 0.3,  duration: 20, shape: "diamond", color: "rgba(52,211,153,0.28)" },
];

function BrightParticle({ id, x, y, size, delay, duration, shape, color }: typeof BRIGHT_PARTICLES[0]) {
  const floatAnim = {
    animate: {
      y: ["0px", "-22px", "8px", "-14px", "0px"],
      x: ["0px", "10px", "-8px", "14px", "0px"],
      rotate: shape === "diamond" || shape === "hex" ? [0, 45, 90, 45, 0] : [0, 10, -10, 5, 0],
      opacity: shape === "dot" ? [0.7, 1, 0.7] : [0.5, 0.9, 0.5],
    },
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  };

  const renderShape = () => {
    switch (shape) {
      case "dot":
        return (
          <div
            style={{
              width: size, height: size,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${size * 1.5}px ${color}`,
            }}
          />
        );
      case "ring":
        return (
          <div
            style={{
              width: size, height: size,
              borderRadius: "50%",
              border: `2.5px solid ${color}`,
              boxShadow: `0 0 ${size * 0.8}px ${color}`,
            }}
          />
        );
      case "diamond":
        return (
          <div
            style={{
              width: size, height: size,
              background: color,
              transform: "rotate(45deg)",
              borderRadius: "4px",
              boxShadow: `0 0 ${size * 1.2}px ${color}`,
            }}
          />
        );
      case "cross":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case "triangle":
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <polygon
              points="20,4 38,36 2,36"
              fill={color.replace("0.22", "0.12")}
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "circle":
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="20" cy="20" r="4" fill={color} />
          </svg>
        );
      case "hex":
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
            <polygon
              points="24,4 42,14 42,34 24,44 6,34 6,14"
              fill={color.replace(/[\d.]+\)$/, "0.10)")}
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
    }
  };

  return (
    <motion.div
      key={id}
      animate={floatAnim.animate}
      transition={floatAnim.transition}
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        filter: `blur(${shape === "dot" ? 0.5 : 0.8}px)`,
      }}
    >
      {renderShape()}
    </motion.div>
  );
}

function ThemeShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isBright = theme === "bright";

  return (
    <div
      data-theme={theme}
      className={`app-shell min-h-screen transition-colors duration-300 relative overflow-x-hidden ${
        theme === "dark"
          ? "bg-[#050b11] text-slate-100"
          : isBright
          ? "bg-[#F0FAF5] text-[#0f1f13]"
          : "bg-[#0c1615] text-slate-100"
      }`}
    >
      {/* ── Cursor Glow ── */}
      <CursorGlow />

      {/* ── Background Layer ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">

        {/* ── BRIGHT MODE: Mint green background gradient ── */}
        {isBright && (
          <>
            {/* Base gradient wash — soft sage/mint */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(145deg, #e6f7ef 0%, #f0faf5 35%, #e8f5ee 65%, #f2fbf6 100%)",
              }}
            />

            {/* Subtle dot-grid texture */}
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.28) 1px, transparent 1.2px)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Large ambient orbs */}
            <motion.div
              animate={{ x: [0, 40, 10, 0], y: [0, -30, 12, 0], scale: [1, 1.12, 0.96, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 70%)", filter: "blur(70px)" }}
            />
            <motion.div
              animate={{ x: [0, -35, 18, 0], y: [0, 28, -18, 0], scale: [1, 1.18, 1, 1] }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-16 -right-24 w-[560px] h-[560px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", filter: "blur(80px)" }}
            />
            <motion.div
              animate={{ x: [0, 25, -30, 0], y: [0, -22, 18, 0], scale: [1, 1.1, 0.92, 1] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
              className="absolute bottom-[-8%] left-1/3 w-[680px] h-[680px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)", filter: "blur(90px)" }}
            />

            {/* ── Flowing Creative Particles ── */}
            {BRIGHT_PARTICLES.map((p) => (
              <BrightParticle key={p.id} {...p} />
            ))}

            {/* Flowing curved line SVG decoration (top-right) */}
            <motion.svg
              animate={{ opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[420px] h-[320px]"
              viewBox="0 0 420 320"
              fill="none"
            >
              <path
                d="M420 0 C300 80, 200 60, 120 160 S20 260, 0 320"
                stroke="rgba(16,185,129,0.25)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <path
                d="M420 40 C310 100, 220 90, 140 180 S40 270, 20 320"
                stroke="rgba(52,211,153,0.18)"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
            </motion.svg>

            {/* Flowing curved line SVG (bottom-left) */}
            <motion.svg
              animate={{ opacity: [0.10, 0.20, 0.10] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-0 left-0 w-[380px] h-[280px]"
              viewBox="0 0 380 280"
              fill="none"
            >
              <path
                d="M0 280 C80 200, 100 140, 200 100 S320 40, 380 0"
                stroke="rgba(16,185,129,0.22)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <path
                d="M0 240 C90 170, 120 120, 210 90 S330 30, 380 0"
                stroke="rgba(52,211,153,0.15)"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
            </motion.svg>
          </>
        )}

        {/* ── DARK MODE: Ambient orbs only ── */}
        {theme === "dark" && (
          <>
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <motion.div
              animate={{ x: [0, 45, 10, 0], y: [0, -35, 15, 0], scale: [1, 1.15, 0.95, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-emerald-600/[0.08] blur-[130px]"
            />
            <motion.div
              animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0], scale: [1, 1.2, 1, 1] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-20 -right-20 w-[520px] h-[520px] rounded-full bg-cyan-600/[0.07] blur-[140px]"
            />
            <motion.div
              animate={{ x: [0, 30, -35, 0], y: [0, -25, 20, 0], scale: [1, 1.15, 0.9, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-teal-700/[0.07] blur-[150px]"
            />
            {/* Floating geometric particle 1 */}
            <motion.div
              animate={{ y: [0, -50, 0], x: [0, 20, 0], rotate: [0, 180, 360], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-[12%] text-emerald-400/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
              </svg>
            </motion.div>
            {/* Floating geometric particle 2 */}
            <motion.div
              animate={{ y: [0, 45, 0], x: [0, -25, 0], rotate: [360, 180, 0], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-2/3 right-[14%] text-cyan-400/20"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="14" cy="14" r="10" strokeDasharray="3 3" />
                <circle cx="14" cy="14" r="3" fill="currentColor" />
              </svg>
            </motion.div>
          </>
        )}

        {/* ── MID MODE: Teal toned orbs ── */}
        {theme === "mid" && (
          <>
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(#0d9488 1px, transparent 1px), linear-gradient(90deg, #0d9488 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <motion.div
              animate={{ x: [0, 40, 10, 0], y: [0, -30, 12, 0], scale: [1, 1.12, 0.96, 1] }}
              transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-teal-500/[0.12] blur-[130px]"
            />
            <motion.div
              animate={{ x: [0, -38, 18, 0], y: [0, 28, -18, 0] }}
              transition={{ duration: 23, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-16 -right-20 w-[540px] h-[540px] rounded-full bg-emerald-500/[0.12] blur-[140px]"
            />
            <motion.div
              animate={{ x: [0, 28, -32, 0], y: [0, -22, 18, 0] }}
              transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
              className="absolute bottom-[-10%] left-1/3 w-[620px] h-[620px] rounded-full bg-cyan-600/[0.08] blur-[150px]"
            />
          </>
        )}
      </div>

      <div className="app-shell-content relative min-h-screen flex flex-col">
        {children}
        <WellnessAssistant />
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased overflow-x-hidden">
        <AuthProvider>
          <ThemeProvider>
            <ThemeShell>{children}</ThemeShell>
          </ThemeProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
