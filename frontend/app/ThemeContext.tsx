import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "bright" | "mid";

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
      const saved = (localStorage.getItem("nexus-theme-mode") || localStorage.getItem("rakshak-theme-mode")) as ThemeMode | null;
      if (saved === "dark" || saved === "bright" || saved === "mid") {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem("nexus-theme-mode", mode);
    } catch {}
  };

  const cycleTheme = () => {
    // 3 modes: dark -> bright -> mid -> dark
    const next: ThemeMode =
      theme === "dark" ? "bright" : theme === "bright" ? "mid" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
