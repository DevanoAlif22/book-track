import React, { useState, useEffect } from "react";
import { Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "../types/BookType";
import BookCard from "../components/BookCard";
import BookApiService, { handleApiError } from "../services/bookApi";

interface ApiResponse {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const BookSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700 transition-colors duration-300">
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
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mt-[-30px]"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </div>
  </div>
);

const IndonesianBookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [error, setError] = useState<string>("");

  const fetchBooks = async (page: number = 1, keyword: string = "") => {
    setLoading(true);
    setError("");

    try {
      const data = await BookApiService.getBooks({
        page,
        sort: "desc",
        keyword: keyword.trim() || undefined,
      });

      setBooks(data.books);
      setPagination(data.pagination);

      console.log("Fetched data:", data); // Debug log
    } catch (err) {
      setError(handleApiError(err));
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (
    e?:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchBooks(1, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    if (
      newPage !== currentPage &&
      newPage >= 1 &&
      pagination &&
      newPage <= pagination.totalPages
    ) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pagination.totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            i === currentPage
              ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Sebelumnya</span>
        </button>

        {pages}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            Perpustakaan Digital Indonesia
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Temukan koleksi buku terbaru dari penerbit terpercaya di Indonesia
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search book titles, authors, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch(e);
                }}
                className="w-full pl-12 pr-32 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-lg transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {pagination && !loading && (
          <div className="text-center mb-8">
            <div className="inline-block bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <p className="text-gray-600 dark:text-gray-300">
                Menampilkan{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {books.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {pagination.totalItems.toLocaleString()}
                </span>{" "}
                buku (Halaman {currentPage} dari {pagination.totalPages})
                {searchTerm && (
                  <span>
                    {" "}
                    untuk pencarian "
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {searchTerm}
                    </span>
                    "
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl mb-6 text-center transition-colors duration-300">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <BookSkeleton key={index} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 max-w-md mx-auto transition-colors duration-300">
              <BookOpen className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-3">
                Tidak ada buku ditemukan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                {searchTerm
                  ? `Tidak ada hasil untuk "${searchTerm}". Coba kata kunci lain.`
                  : "Coba sesuaikan kriteria pencarian Anda"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                    fetchBooks(1, "");
                  }}
                  className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Lihat Semua Buku
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
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
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default IndonesianBookList;
