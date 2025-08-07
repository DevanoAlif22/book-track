import React, { useState, useEffect } from "react";
import { Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "../types/BookType";
import BookCard from "../components/BookCard";
import BookApiService, { handleApiError } from "../services/bookApi";

// Interface untuk data yang datang dari API
interface ApiAuthor {
  name?: string;
  url?: string;
}

interface ApiCategory {
  name?: string;
  url?: string;
}

interface ApiDetails {
  no_gm?: string;
  isbn?: string;
  price?: string;
  total_pages?: string;
  size?: string;
  published_date?: string;
  format?: string;
}

interface ApiTag {
  name?: string;
  url?: string;
}

interface ApiBuyLink {
  store?: string;
  url?: string;
}

// Interface untuk raw data dari API
interface ApiBookData {
  _id?: string;
  title?: string;
  author?: ApiAuthor;
  category?: ApiCategory;
  cover_image?: string;
  coverImage?: string;
  details?: ApiDetails;
  tags?: (ApiTag | string)[];
  summary?: string;
  description?: string;
  buy_links?: ApiBuyLink[];
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  pageCount?: number;
  language?: string;
  rating?: number;
  reviewCount?: number;
  price?: number | string;
  availability?: boolean;
  createdAt?: string;
  updatedAt?: string;
  no_gm?: string;
}
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
  <div className="bg-theme-card rounded-xl shadow-lg overflow-hidden animate-pulse border border-theme transition-colors duration-300">
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

// Utility function untuk memvalidasi dan membersihkan data book - FIXED VERSION
const sanitizeBook = (book: ApiBookData): Book | null => {
  try {
    // Pastikan semua field yang required ada
    if (!book || !book._id || !book.title) {
      console.warn("Invalid book data:", book);
      return null;
    }

    // Helper function untuk normalize tag
    const normalizeTag = (
      tag: ApiTag | string
    ): { name: string; url: string } => {
      if (typeof tag === "string") {
        return { name: tag, url: "" };
      }
      return {
        name: tag.name || "",
        url: tag.url || "",
      };
    };

    return {
      _id: book._id,
      title: book.title || "Judul tidak tersedia",
      author: {
        name: book.author?.name || "Penulis tidak diketahui",
        url: book.author?.url || "",
      },
      category: {
        name: book.category?.name || "Kategori tidak tersedia",
        url: book.category?.url || "",
      },
      cover_image: book.cover_image || book.coverImage || "",
      details: {
        no_gm: book.details?.no_gm || book.no_gm || "",
        isbn: book.details?.isbn || book.isbn || "",
        price:
          book.details?.price ||
          (typeof book.price === "number"
            ? book.price.toString()
            : book.price) ||
          "0",
        total_pages:
          book.details?.total_pages ||
          (book.pageCount ? `${book.pageCount} pages` : "0 pages"),
        size: book.details?.size || "",
        published_date:
          book.details?.published_date ||
          (book.publishedYear
            ? book.publishedYear.toString()
            : new Date().getFullYear().toString()),
        format: book.details?.format || "",
      },
      tags: Array.isArray(book.tags) ? book.tags.map(normalizeTag) : [],
      summary: book.summary || book.description || "Deskripsi tidak tersedia",
      buy_links: Array.isArray(book.buy_links)
        ? book.buy_links.map((link) => ({
            store: link.store || "Toko Online",
            url: link.url || "",
          }))
        : [],
      publisher: book.publisher || "Penerbit tidak diketahui",

      // Optional properties yang mungkin digunakan di tempat lain
      description:
        book.description || book.summary || "Deskripsi tidak tersedia",
      coverImage: book.coverImage || book.cover_image || "",
      publishedYear: book.publishedYear || new Date().getFullYear(),
      isbn: book.isbn || book.details?.isbn || "",
      pageCount:
        book.pageCount ||
        (book.details?.total_pages
          ? parseInt(book.details.total_pages.replace(" pages", ""))
          : 0),
      language: book.language || "Indonesia",
      rating: book.rating || 0,
      reviewCount: book.reviewCount || 0,
      price:
        typeof book.price === "number"
          ? book.price
          : parseInt((book.details?.price || "0").replace(/[^\d]/g, "")),
      availability: book.availability !== undefined ? book.availability : true,
      createdAt: book.createdAt || new Date().toISOString(),
      updatedAt: book.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sanitizing book:", error, book);
    return null;
  }
};

const IndonesianBookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [error, setError] = useState<string>("");

  // Ganti fetchBooks function Anda dengan yang ini
  const fetchBooks = async (page: number = 1, keyword: string = "") => {
    setLoading(true);
    setError("");

    try {
      const data = await BookApiService.getBooks({
        page,
        sort: "desc",
        keyword: keyword.trim() || undefined,
      });

      console.log("Raw API response:", data); // Debug log

      // Cast ke ApiBookData[] dan sanitize books yang valid
      const rawBooks = data.books as ApiBookData[];
      const sanitizedBooks = rawBooks
        .map(sanitizeBook)
        .filter((book): book is Book => book !== null);

      console.log("Sanitized books:", sanitizedBooks); // Debug log

      setBooks(sanitizedBooks);
      setPagination(data.pagination);
    } catch (err) {
      setError(handleApiError(err));
      console.error("Error fetching books:", err);
      // Reset books jika terjadi error
      setBooks([]);
      setPagination(null);
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

    const renderPageNumbers = () => {
      const pages = [];
      const totalPages = pagination.totalPages;

      // Always show first page
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            1 === currentPage
              ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
              : "bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme"
          }`}
        >
          1
        </button>
      );

      // Show ellipsis after first page if needed
      if (currentPage > 4) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-theme-secondary">
            ...
          </span>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          // Don't duplicate first and last page
          pages.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                i === currentPage
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                  : "bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme"
              }`}
            >
              {i}
            </button>
          );
        }
      }

      // Show ellipsis before last page if needed
      if (currentPage < totalPages - 3) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-theme-secondary">
            ...
          </span>
        );
      }

      // Always show last page (if more than 1 page total)
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              totalPages === currentPage
                ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                : "bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme"
            }`}
          >
            {totalPages}
          </button>
        );
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme hover:shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Sebelumnya</span>
        </button>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme hover:shadow-md"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-theme-primary py-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4 transition-colors duration-300">
            Perpustakaan Digital Indonesia
          </h1>
          <p className="text-lg text-theme-secondary max-w-2xl mx-auto transition-colors duration-300">
            Temukan koleksi buku terbaru dari penerbit terpercaya di Indonesia
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-theme-muted" />
              <input
                type="text"
                placeholder="Search book titles, authors, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch(e);
                }}
                className="w-full pl-12 pr-32 py-4 border border-theme bg-theme-card text-theme-primary rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-lg transition-all duration-300 shadow-sm hover:shadow-md"
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
            <div className="inline-block bg-theme-card px-6 py-3 rounded-full shadow-sm border border-theme transition-colors duration-300">
              <p className="text-theme-secondary">
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
            <div className="bg-theme-card rounded-2xl p-12 shadow-lg border border-theme max-w-md mx-auto transition-colors duration-300">
              <BookOpen className="h-20 w-20 text-theme-muted mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-theme-secondary mb-3">
                Tidak ada buku ditemukan
              </h3>
              <p className="text-theme-muted mb-8">
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
              <BookCard key={book._id} book={book} />
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
