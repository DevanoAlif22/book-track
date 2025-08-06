import React, { useEffect, useState } from "react";
import { BookOpen, Tag, BarChart3 } from "lucide-react";
import BookCard from "../components/BookCard";
import type { Book } from "../types/BookType";

interface CategoryStats {
  name: string;
  count: number;
}

const FavoriteBookList: React.FC = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [showStats, setShowStats] = useState(false);

  // Function to calculate category statistics
  const calculateCategoryStats = (books: Book[]): CategoryStats[] => {
    const stats: { [key: string]: number } = {};

    books.forEach((book) => {
      const categoryName = book.category?.name || "Tidak Berkategori";
      stats[categoryName] = (stats[categoryName] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  };

  // Function to load favorites from localStorage
  const loadFavorites = () => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    console.log("Loaded favorites:", storedFavorites);
    setFavorites(storedFavorites);
    setCategoryStats(calculateCategoryStats(storedFavorites));
  };

  useEffect(() => {
    // Load favorites when component mounts
    loadFavorites();

    // Listen for storage changes (when localStorage is modified in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favorites") {
        loadFavorites();
      }
    };

    // Listen for custom event (for same-tab updates)
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Belum ada buku favorit
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Tambahkan buku ke favorit dari halaman utama
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Stats Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Daftar Buku Favorit ({favorites.length})
          </h2>

          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 self-start sm:self-auto"
          >
            <BarChart3 className="h-4 w-4" />
            <span>{showStats ? "Sembunyikan" : "Tampilkan"} Statistik</span>
          </button>
        </div>

        {/* Category Statistics */}
        {showStats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              <Tag className="h-5 w-5 text-blue-500" />
              <span>Statistik Berdasarkan Kategori</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate mr-2">
                      {stat.name}
                    </h4>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                      {stat.count} buku
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(stat.count / favorites.length) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {((stat.count / favorites.length) * 100).toFixed(1)}% dari
                    total
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span>
                  <strong>Total Buku:</strong> {favorites.length}
                </span>
                <span>
                  <strong>Kategori Berbeda:</strong> {categoryStats.length}
                </span>
                <span>
                  <strong>Kategori Terfavorit:</strong> {categoryStats[0]?.name}{" "}
                  ({categoryStats[0]?.count} buku)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <BookCard
              key={book._id}
              book={{
                ...book,
                category: {
                  ...book.category,
                  name: book.category.name ?? "",
                },
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteBookList;
