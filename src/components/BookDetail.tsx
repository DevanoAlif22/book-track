import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  BookOpen,
  Tag,
  ExternalLink,
  Heart,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Share2,
} from "lucide-react";
import type { Book } from "../types/BookType";
import { BookApiService, handleApiError } from "../services/bookApi";

// Skeleton component for loading state
const BookDetailSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Cover Skeleton */}
      <div>
        <div className="w-full h-96 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        <div className="mt-4 w-24 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      {/* Info Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="flex space-x-4">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
        </div>
        <div className="flex space-x-4 mt-6">
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
        </div>
      </div>
    </div>
  </div>
);

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Fetch book details
  const fetchBookDetails = useCallback(async () => {
    if (!bookId) {
      setError("Book ID tidak ditemukan");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookData = await BookApiService.getBookById(bookId);
      setBook(bookData);

      // Check if book is in favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.some((fav: Book) => fav._id === bookData._id));
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching book details:", err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!book || isTogglingFavorite) return;

    setIsTogglingFavorite(true);

    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      let updatedFavorites: Book[];

      if (isFavorite) {
        updatedFavorites = favorites.filter(
          (fav: Book) => fav._id !== book._id
        );
      } else {
        updatedFavorites = [...favorites, book];
      }

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));

      // Show success message (you can implement toast notifications here)
      console.log(
        isFavorite ? "Buku dihapus dari favorit" : "Buku ditambahkan ke favorit"
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
      // You can show an error toast here
    } finally {
      setIsTogglingFavorite(false);
    }
  }, [book, isFavorite, isTogglingFavorite]);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (!book) return;

    const shareData = {
      title: book.title,
      text: `Lihat buku "${book.title}" oleh ${book.author.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You can show a toast notification here
        console.log("Link berhasil disalin ke clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  }, [book]);

  // Go back function
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Retry function
  const handleRetry = useCallback(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Gagal Memuat Detail Buku
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRetry}
                className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Coba Lagi</span>
              </button>
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Buku Tidak Ditemukan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Buku yang Anda cari tidak dapat ditemukan.
            </p>
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Buku</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Kembali ke Daftar Buku</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Book Cover */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-auto object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-book-cover.jpg"; // You can add a placeholder image
                  }}
                />
              </div>

              {book.category?.name && (
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    {book.category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                  {book.title}
                </h1>

                <div className="flex items-center text-gray-600 dark:text-gray-300 space-x-2 mb-4">
                  <User className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  {book.author?.url ? (
                    <a
                      href={book.author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                    >
                      {book.author.name}
                    </a>
                  ) : (
                    <span>{book.author?.name}</span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {book.details?.published_date && (
                  <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDate(book.details.published_date)}
                    </span>
                  </div>
                )}
                {book.details?.total_pages && (
                  <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {book.details.total_pages} halaman
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              {book.details?.price && (
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                    {book.details.price}
                  </p>
                </div>
              )}

              {/* Description */}
              {book.summary && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Ringkasan
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {book.summary}
                  </p>
                </div>
              )}

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Buy Links */}
              {book.buy_links && book.buy_links.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Beli Buku Ini
                  </h3>
                  <div className="space-y-2">
                    {book.buy_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>{link.store}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleFavorite}
                  disabled={isTogglingFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isFavorite
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  } ${
                    isTogglingFavorite ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-current" : ""} ${
                      isTogglingFavorite ? "animate-pulse" : ""
                    }`}
                  />
                  <span>
                    {isTogglingFavorite
                      ? "Menyimpan..."
                      : isFavorite
                      ? "Hapus dari Favorit"
                      : "Tambah ke Favorit"}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
