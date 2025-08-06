import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Book, Home, Heart, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onMenuClick?: (menu: "home" | "favorite" | "search") => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menu: "home" | "favorite" | "search") => {
    setIsOpen(false);
    onMenuClick?.(menu);
  };

  const menuItems = [
    { id: "home", label: "Beranda", icon: Home, route: "/home" },
    { id: "search", label: "Cari Buku", icon: Search, route: "/search" },
    { id: "favorite", label: "Favorit", icon: Heart, route: "/favorites" },
  ];

  // Function to determine if menu item is active based on current route
  const isMenuActive = (route: string) => {
    return (
      location.pathname === route ||
      (route === "/home" && location.pathname === "/")
    );
  };

  return (
    <nav className="bg-theme-primary shadow-lg sticky top-0 z-50 border-b border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-theme-primary">
              BookTrack
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isMenuActive(item.route);

                return (
                  <Link
                    key={item.id}
                    to={item.route}
                    onClick={() =>
                      handleMenuClick(item.id as "home" | "favorite" | "search")
                    }
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-theme-secondary hover:bg-theme-secondary hover:text-theme-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            {/* Theme Toggle */}
            <ThemeToggle variant="dropdown" size="md" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary focus:ring-blue-500"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-theme bg-theme-secondary">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item.route);

            return (
              <Link
                key={item.id}
                to={item.route}
                onClick={() =>
                  handleMenuClick(item.id as "home" | "favorite" | "search")
                }
                className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-theme-secondary hover:bg-theme-card hover:text-theme-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {/* Theme Toggle for Mobile */}
          <div className="px-3 py-2 border-t border-theme">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-theme-secondary">
                Theme
              </span>
              <ThemeToggle variant="switch" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
