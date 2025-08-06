import React, { useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

interface ThemeToggleProps {
  variant?: "button" | "switch" | "dropdown";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "button",
  size = "md",
  showLabel = false,
}) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const themes = [
    {
      key: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light and clean interface",
    },
    {
      key: "dark" as const,
      label: "Dark",
      icon: Moon,
      description: "Dark theme for low light",
    },
    {
      key: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ];

  if (variant === "switch") {
    return (
      <div className="flex items-center space-x-3">
        {showLabel && (
          <span className="text-sm font-medium text-theme-secondary">
            {actualTheme === "dark" ? "Dark" : "Light"}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            actualTheme === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label={`Switch to ${
            actualTheme === "dark" ? "light" : "dark"
          } mode`}
        >
          <span
            className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform duration-300 ${
              actualTheme === "dark" ? "translate-x-6" : "translate-x-1"
            }`}
          />
          <Sun
            className={`absolute left-1 w-3 h-3 text-yellow-500 transition-opacity duration-300 ${
              actualTheme === "dark" ? "opacity-0" : "opacity-100"
            }`}
          />
          <Moon
            className={`absolute right-1 w-3 h-3 text-blue-300 transition-opacity duration-300 ${
              actualTheme === "dark" ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
      </div>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`${sizeClasses[size]} rounded-lg bg-theme-card border border-theme hover:bg-theme-secondary transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label="Theme selector"
        >
          {theme === "system" ? (
            <Monitor className={`${iconSizes[size]} text-theme-secondary`} />
          ) : theme === "dark" ? (
            <Moon className={`${iconSizes[size]} text-blue-400`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-yellow-500`} />
          )}
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-theme-card rounded-xl shadow-lg border border-theme py-2 z-20">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.key;

                return (
                  <button
                    key={themeOption.key}
                    onClick={() => {
                      setTheme(themeOption.key);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-theme-secondary flex items-center space-x-3 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "text-theme-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-medium">{themeOption.label}</div>
                      <div className="text-xs text-theme-muted">
                        {themeOption.description}
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <div className="flex items-center space-x-3">
      {showLabel && (
        <span className="text-sm font-medium text-theme-secondary">
          {actualTheme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      )}
      <button
        onClick={toggleTheme}
        className={`${sizeClasses[size]} rounded-lg bg-theme-card border border-theme hover:bg-theme-secondary transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 shadow-sm hover:shadow-md`}
        aria-label={`Switch to ${
          actualTheme === "dark" ? "light" : "dark"
        } mode`}
      >
        {actualTheme === "dark" ? (
          <Moon className={`${iconSizes[size]} text-blue-400`} />
        ) : (
          <Sun className={`${iconSizes[size]} text-yellow-500`} />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
