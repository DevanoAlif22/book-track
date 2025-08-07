import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  BookOpen,
  RefreshCw,
  Star,
  Eye,
  Award,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import type { Book } from "../types/BookType";
import BookCard from "../components/BookCard";
import { BookApiService, handleApiError } from "../services/bookApi";

const BookSkeleton: React.FC<{ index: number }> = ({ index }) => (
  <div
    className="bg-theme-card rounded-xl shadow-lg overflow-hidden animate-pulse border border-theme transition-colors duration-300"
    data-aos="fade-up"
    data-aos-delay={index * 100}
  >
    <div className="h-72 bg-gray-300 dark:bg-gray-600"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-3"></div>
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </div>
  </div>
);

const StatsCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  index: number;
}> = ({ icon, title, value, subtitle, color, index }) => (
  <div
    className="bg-theme-card rounded-xl shadow-sm border border-theme p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    data-aos="flip-up"
    data-aos-delay={index * 200}
    data-aos-duration="600"
  >
    <div className="flex items-center space-x-4">
      <div
        className={`p-3 rounded-full ${color} transform transition-transform duration-300 hover:scale-110`}
        data-aos="zoom-in"
        data-aos-delay={index * 200 + 300}
      >
        {icon}
      </div>
      <div>
        <h3
          className="font-semibold text-theme-primary"
          data-aos="fade-right"
          data-aos-delay={index * 200 + 400}
        >
          {title}
        </h3>
        <p
          className="text-2xl font-bold text-theme-primary"
          data-aos="fade-up"
          data-aos-delay={index * 200 + 500}
        >
          {value}
        </p>
        <p
          className="text-sm text-theme-muted"
          data-aos="fade-left"
          data-aos-delay={index * 200 + 600}
        >
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

const BookPopularSection: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [displayCount, setDisplayCount] = useState<number>(8);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  // Fetch popular books using BookApiService
  const fetchPopularBooks = useCallback(async (limit: number = 8) => {
    setLoading(true);
    setError("");

    try {
      // Since the API doesn't seem to have a "popular" sort specifically,
      // we'll use the latest books as popular (you can adjust this logic)
      const data = await BookApiService.getLatestBooks(1);

      // Take only the requested number of books
      const limitedBooks = data.books.slice(0, limit);
      setBooks(limitedBooks);
      setTotalBooks(data.pagination.totalItems);
      setLastUpdated(new Date());

      // Refresh AOS after data loads
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching popular books:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularBooks(displayCount);
  }, [fetchPopularBooks, displayCount]);

  // Handle retry
  const handleRetry = useCallback(() => {
    fetchPopularBooks(displayCount);
  }, [fetchPopularBooks, displayCount]);

  // Handle show less
  const handleShowLess = useCallback(() => {
    const newCount = Math.max(8, displayCount - 8);
    setDisplayCount(newCount);
    setBooks((prev) => prev.slice(0, newCount));
  }, [displayCount]);

  // Format last updated time
  const getLastUpdatedText = () => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Baru saja diperbarui";
    if (diffInMinutes < 60)
      return `Diperbarui ${diffInMinutes} menit yang lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Diperbarui ${diffInHours} jam yang lalu`;

    return lastUpdated.toLocaleDateString("id-ID");
  };

  return (
    <div
      id="popular"
      className="min-h-screen bg-theme-secondary py-8 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-theme-primary mb-4 transition-colors duration-300"
            data-aos="fade-down"
            data-aos-duration="800"
          >
            Buku Populer
          </h1>
          <p
            className="text-lg text-theme-secondary max-w-2xl mx-auto transition-colors duration-300"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            Koleksi buku terpopuler yang paling banyak dibaca dan
            direkomendasikan pembaca
          </p>
          {!loading && !error && (
            <p
              className="text-sm text-theme-muted mt-2"
              data-aos="fade-in"
              data-aos-delay="400"
            >
              {getLastUpdatedText()}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        {!loading && !error && books.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <StatsCard
              icon={<BookOpen className="h-6 w-6 text-white" />}
              title="Total Buku"
              value={totalBooks.toLocaleString()}
              subtitle="Koleksi tersedia"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              index={0}
            />
            <StatsCard
              icon={<Star className="h-6 w-6 text-white" />}
              title="Buku Populer"
              value={books.length.toString()}
              subtitle="Sedang ditampilkan"
              color="bg-gradient-to-r from-yellow-500 to-orange-500"
              index={1}
            />
            <StatsCard
              icon={<Eye className="h-6 w-6 text-white" />}
              title="Kategori"
              value={new Set(
                books.map((book) => book.category?.name).filter(Boolean)
              ).size.toString()}
              subtitle="Beragam genre"
              color="bg-gradient-to-r from-green-500 to-emerald-500"
              index={2}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl mb-6 text-center transition-colors duration-300"
            data-aos="shake"
            data-aos-duration="1000"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium mx-auto transform hover:scale-105"
              data-aos="bounce"
              data-aos-delay="500"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: displayCount }).map((_, index) => (
              <BookSkeleton key={index} index={index} />
            ))}
          </div>
        ) : books.length === 0 && !error ? (
          <div className="text-center py-20">
            <div
              className="bg-theme-card rounded-2xl p-12 shadow-lg border border-theme max-w-md mx-auto transition-colors duration-300"
              data-aos="zoom-in"
              data-aos-duration="800"
            >
              <div className="relative mb-6">
                <div
                  className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto flex items-center justify-center"
                  data-aos="flip-left"
                  data-aos-delay="200"
                >
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  data-aos="bounce"
                  data-aos-delay="600"
                >
                  <Award className="h-4 w-4 text-yellow-800" />
                </div>
              </div>
              <h3
                className="text-2xl font-semibold text-theme-secondary mb-3"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Belum Ada Buku Populer
              </h3>
              <p
                className="text-theme-muted mb-8"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                Data buku populer sedang tidak tersedia. Coba muat ulang atau
                periksa koneksi internet Anda.
              </p>
              <button
                onClick={handleRetry}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 dark:hover:from-orange-600 dark:hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium mx-auto transform hover:scale-105"
                data-aos="pulse"
                data-aos-delay="700"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Muat Ulang</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <div key={book._id} className="relative">
                  {/* Popularity Badge for top 3 */}
                  {index < 3 && (
                    <div
                      className="absolute -top-2 -left-2 z-10"
                      data-aos="zoom-in"
                      data-aos-delay={index * 100 + 100}
                      data-aos-duration="500"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transform hover:scale-110 transition-transform duration-300 ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-400 to-gray-500"
                            : "bg-gradient-to-r from-amber-600 to-amber-700"
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

            {/* Load More / Show Less Controls */}
            {books.length > 0 && (
              <div
                className="flex justify-center items-center space-x-4 mt-12"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {displayCount > 8 && (
                  <button
                    onClick={handleShowLess}
                    className="flex items-center space-x-2 bg-theme-card text-theme-primary px-6 py-3 rounded-lg hover:bg-theme-secondary border border-theme transition-all duration-200 shadow-sm hover:shadow-md font-medium transform hover:scale-105"
                    data-aos="slide-right"
                    data-aos-delay="300"
                  >
                    <span>Tampilkan Lebih Sedikit</span>
                  </button>
                )}

                {displayCount >= 32 && (
                  <p
                    className="text-theme-muted text-sm italic"
                    data-aos="fade-in"
                    data-aos-delay="400"
                  >
                    Menampilkan maksimum buku populer
                  </p>
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
