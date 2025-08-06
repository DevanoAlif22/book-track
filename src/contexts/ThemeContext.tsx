import React, { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Function to get system preference
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// Function to apply theme to DOM
const applyTheme = (newTheme: "light" | "dark") => {
  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove("light", "dark");

  // Add new theme class
  root.classList.add(newTheme);

  // Set data attribute for additional styling if needed
  root.setAttribute("data-theme", newTheme);
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      return stored || "system";
    }
    return "system";
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  // Effect to handle theme changes
  useEffect(() => {
    let effectiveTheme: "light" | "dark";

    if (theme === "system") {
      effectiveTheme = getSystemTheme();
    } else {
      effectiveTheme = theme;
    }

    applyTheme(effectiveTheme);
    setActualTheme(effectiveTheme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Effect to listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        if (theme === "system") {
          const systemTheme = getSystemTheme();
          applyTheme(systemTheme);
          setActualTheme(systemTheme);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = theme === "system" ? getSystemTheme() : theme;
    applyTheme(initialTheme);
    setActualTheme(initialTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // If system, toggle to opposite of current actual theme
      setTheme(actualTheme === "light" ? "dark" : "light");
    }
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Export the context and types for use in the hook
export { ThemeContext };
export type { ThemeContextType };
