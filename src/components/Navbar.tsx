import React, { useState } from "react";
import { Link } from "react-router";
import { Menu, X, Book, Home, Heart, Search } from "lucide-react";

interface NavbarProps {
  activeMenu?: "home" | "favorite" | "search";
  onMenuClick?: (menu: "home" | "favorite" | "search") => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activeMenu = "home",
  onMenuClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              BookTrack
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

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
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 dark:focus:ring-blue-400"
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
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t transition-colors duration-300 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

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
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// Demo component untuk menunjukkan penggunaan
const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<"home" | "favorite" | "search">(
    "home"
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
    </div>
  );
};

export default App;
