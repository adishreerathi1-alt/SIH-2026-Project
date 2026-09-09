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

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
  },
];

function ThemeShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      className={`min-h-screen transition-colors duration-500 relative overflow-x-hidden ${
        theme === "dark"
          ? "bg-[#050b11] text-slate-100"
          : "bg-[#edf2f7] text-[#000000]"
      }`}
    >
      {/* Subtle Ambient Cursor Follower */}
      <CursorGlow />

      {/* ================= FLOATING ANIMATED OBJECTS IN ALL MODES ================= */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        
        {/* Subtle Background Grid Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            theme === "dark"
              ? "opacity-[0.035]"
              : theme === "bright"
              ? "opacity-[0.055]"
              : "opacity-[0.06]"
          }`}
          style={{
            backgroundImage: `linear-gradient(${
              theme === "bright" ? "#059669" : "#10b981"
            } 1px, transparent 1px), linear-gradient(90deg, ${
              theme === "bright" ? "#059669" : "#10b981"
            } 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />

        {/* Floating Orb 1 (Top Left) */}
        <motion.div
          animate={{
            x: [0, 45, 10, 0],
            y: [0, -35, 15, 0],
            scale: [1, 1.18, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -top-16 -left-16 w-[480px] h-[480px] rounded-full blur-[130px] ${
            theme === "dark"
              ? "bg-emerald-600/12"
              : theme === "bright"
              ? "bg-emerald-400/25"
              : "bg-emerald-500/16"
          }`}
        />

        {/* Floating Orb 2 (Top Right) */}
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 30, -20, 0],
            scale: [1, 1.22, 1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className={`absolute top-20 -right-20 w-[520px] h-[520px] rounded-full blur-[140px] ${
            theme === "dark"
              ? "bg-cyan-600/10"
              : theme === "bright"
              ? "bg-teal-300/30"
              : "bg-teal-500/15"
          }`}
        />

        {/* Floating Orb 3 (Bottom Center) */}
        <motion.div
          animate={{
            x: [0, 30, -35, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className={`absolute bottom-[-10%] left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] ${
            theme === "dark"
              ? "bg-teal-700/8"
              : theme === "bright"
              ? "bg-emerald-300/25"
              : "bg-emerald-600/10"
          }`}
        />

        {/* Ambient Floating Particle 1 (Soft Geometric Crosshair) */}
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-1/4 left-[12%] flex items-center justify-center ${
            theme === "bright" ? "text-emerald-700/30" : "text-emerald-400/20"
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
          </svg>
        </motion.div>

        {/* Ambient Floating Particle 2 (Gentle Floating Node) */}
        <motion.div
          animate={{
            y: [0, 45, 0],
            x: [0, -25, 0],
            rotate: [360, 180, 0],
            opacity: [0.25, 0.65, 0.25],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className={`absolute top-2/3 right-[14%] flex items-center justify-center ${
            theme === "bright" ? "text-teal-700/25" : "text-cyan-400/20"
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="14" cy="14" r="10" strokeDasharray="3 3" />
            <circle cx="14" cy="14" r="3" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Ambient Floating Particle 3 (Upper Right Corner Ring) */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            scale: [0.9, 1.15, 0.9],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className={`absolute top-[18%] right-[28%] ${
            theme === "bright" ? "text-emerald-800/20" : "text-emerald-400/15"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="14" height="14" rx="3" strokeDasharray="2 2" />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </svg>
        </motion.div>

      </div>

      <div className="relative min-h-screen flex flex-col">
        {children}
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
        <ThemeProvider>
          <AuthProvider>
            <ThemeShell>{children}</ThemeShell>
          </AuthProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
