import React, { useEffect } from "react";
import { BookOpen, RefreshCw, Star, Eye } from "lucide-react";

// Components
import BookCard from "../components/BookCard";
import BookSkeleton from "../components/ui/BookSkeleton";
import StatsCard from "../components/ui/StatsCard";
import EmptyState from "../components/ui/EmptyState";

// Hooks
import { useAOS } from "../hooks/useAOS";
import { usePopularBooks } from "../hooks/usePopularBooks";
import { useLastUpdated } from "../hooks/useLastUpdated";

// Utils & Constants
import { STATS_COLORS, POPULARITY_BADGE_COLORS } from "../utils/constants";

const BookPopularSection: React.FC = () => {
  const { refreshAOS } = useAOS();
  const { getLastUpdatedText, updateTimestamp } = useLastUpdated();
  const {
    books,
    loading,
    error,
    totalBooks,
    displayCount,
    fetchBooks,
    handleShowLess,
    retry,
  } = usePopularBooks();

  useEffect(() => {
    const loadBooks = async () => {
      const result = await fetchBooks(displayCount);
      if (result.length > 0) {
        updateTimestamp();
        refreshAOS();
      }
    };

    loadBooks();
  }, [displayCount]);

  const handleRetry = () => {
    retry();
    updateTimestamp();
  };

  // Stats data
  const statsData = [
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: "Total Buku",
      value: totalBooks.toLocaleString(),
      subtitle: "Koleksi tersedia",
      color: STATS_COLORS.TOTAL_BOOKS,
    },
    {
      icon: <Star className="h-6 w-6 text-white" />,
      title: "Buku Populer",
      value: books.length.toString(),
      subtitle: "Sedang ditampilkan",
      color: STATS_COLORS.POPULAR_BOOKS,
    },
    {
      icon: <Eye className="h-6 w-6 text-white" />,
      title: "Kategori",
      value: new Set(
        books.map((book) => book.category?.name).filter(Boolean)
      ).size.toString(),
      subtitle: "Beragam genre",
      color: STATS_COLORS.CATEGORIES,
    },
  ];

  return (
    <div
      id="popular"
      className="min-h-screen bg-theme-secondary py-8 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            Buku Populer
          </h1>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
            Koleksi buku terpopuler yang paling banyak dibaca dan
            direkomendasikan pembaca
          </p>
          {!loading && !error && (
            <p className="text-sm text-theme-muted mt-2">
              {getLastUpdatedText()}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {statsData.map((stat, index) => (
              <StatsCard key={stat.title} {...stat} index={index} />
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl mb-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: displayCount }).map((_, index) => (
              <BookSkeleton key={index} index={index} />
            ))}
          </div>
        ) : books.length === 0 && !error ? (
          <EmptyState onRetry={handleRetry} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <div key={book._id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                          index === 0
                            ? POPULARITY_BADGE_COLORS.FIRST
                            : index === 1
                            ? POPULARITY_BADGE_COLORS.SECOND
                            : POPULARITY_BADGE_COLORS.THIRD
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  )}
                  <BookCard
                    book={{
                      ...book,
                      category: {
                        ...book.category,
                        name: book.category.name ?? "",
                      },
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Controls */}
            {books.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                {displayCount > 8 && (
                  <button
                    onClick={handleShowLess}
                    className="flex items-center space-x-2 bg-theme-card text-theme-primary px-6 py-3 rounded-lg hover:bg-theme-secondary border border-theme transition-all duration-200"
                  >
                    <span>Tampilkan Lebih Sedikit</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookPopularSection;
