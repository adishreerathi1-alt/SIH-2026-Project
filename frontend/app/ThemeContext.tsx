import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "bright";

interface ThemeContextType {
  theme: ThemeMode;
  cycleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  cycleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    try {
      const saved = (localStorage.getItem("rakshak-theme-mode") || localStorage.getItem("nexus-theme-mode")) as ThemeMode | null;
      if (saved === "dark" || saved === "bright") {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem("rakshak-theme-mode", mode);
    } catch {}
  };

  const cycleTheme = () => {
    // Only 2 modes: dark <-> bright
    const next: ThemeMode = theme === "dark" ? "bright" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
