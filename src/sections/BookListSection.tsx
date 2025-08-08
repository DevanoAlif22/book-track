import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import BookCard from "../components/BookCard";
import { useBookSearch } from "../hooks/useBookSearch";
import { PaginationService } from "../services/paginationService";
import { ScrollUtils } from "../utils/scrollUtils";
import { BOOK_CONSTANTS } from "../constants/bookConstants";

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

const IndonesianBookList: React.FC = () => {
  const [tempSearchTerm, setTempSearchTerm] = useState<string>("");
  const [showGenreFilter, setShowGenreFilter] = useState<boolean>(false);

  const {
    books,
    pagination,
    searchState,
    loading,
    error,
    genres,
    genresLoading,
    updateSearchTerm,
    updateGenre,
    updatePage,
    resetFilters,
    performSearch,
    hasActiveFilters,
    filterDescription,
  } = useBookSearch();

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (tempSearchTerm !== searchState.searchTerm) {
        updateSearchTerm(tempSearchTerm);
        performSearch();
      }
    }, 300); // 300ms delay

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [tempSearchTerm, searchState.searchTerm, updateSearchTerm, performSearch]);

  const handleSearch = (
    e?:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();
    // For immediate search when button is clicked
    updateSearchTerm(tempSearchTerm);
    performSearch();
  };

  // Handle input change for real-time search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempSearchTerm(value);
    // The useEffect will handle the debounced search
  };

  const handleGenreFilter = (genre: string) => {
    updateGenre(genre);
    setShowGenreFilter(false);
  };

  const clearGenreFilter = () => {
    updateGenre("");
  };

  const handlePageChange = (newPage: number) => {
    if (
      pagination &&
      PaginationService.isValidPageChange(
        newPage,
        searchState.currentPage,
        pagination.totalPages
      )
    ) {
      updatePage(newPage);
      ScrollUtils.scrollToTop();
    }
  };

  const handleResetAllFilters = () => {
    setTempSearchTerm("");
    resetFilters();
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pageNumbers = PaginationService.generatePageNumbers(
      searchState.currentPage,
      pagination.totalPages
    );

    const renderPageButton = (page: number | string, index: number) => {
      if (typeof page === "string") {
        return (
          <span key={`ellipsis-${index}`} className="px-2 text-theme-secondary">
            {page}
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            page === searchState.currentPage
              ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
              : "bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme"
          }`}
        >
          {page}
        </button>
      );
    };

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(searchState.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme hover:shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Sebelumnya</span>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map(renderPageButton)}

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(searchState.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-theme-card text-theme-primary hover:bg-theme-secondary border border-theme hover:shadow-md"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderGenreFilter = () => (
    <div className="relative">
      <button
        onClick={() => setShowGenreFilter(!showGenreFilter)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
          searchState.selectedGenre
            ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500"
            : "bg-theme-card text-theme-primary hover:bg-theme-secondary border-theme"
        } shadow-sm hover:shadow-md`}
      >
        <Filter className="h-4 w-4" />
        <span>{searchState.selectedGenre || "Filter Genre"}</span>
      </button>

      {/* Genre Dropdown */}
      {showGenreFilter && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-theme-card border border-theme rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {genresLoading ? (
              <div className="p-4 text-center text-theme-secondary">
                Loading genres...
              </div>
            ) : (
              <div className="space-y-1">
                {genres.map((genre, index) => (
                  <button
                    key={index}
                    onClick={() => handleGenreFilter(genre.genre || "")}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-theme-secondary transition-colors duration-150 flex justify-between items-center group"
                  >
                    <span className="text-theme-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {genre.genre}
                    </span>
                    <span className="text-xs text-theme-muted bg-theme-secondary px-2 py-1 rounded-full">
                      {genre.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSearchStats = () => {
    if (!pagination || loading) return null;

    return (
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
            buku (Halaman {searchState.currentPage} dari {pagination.totalPages}
            )
            {hasActiveFilters && (
              <span>
                {" "}
                untuk{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {filterDescription}
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-20">
      <div className="bg-theme-card rounded-2xl p-12 shadow-lg border border-theme max-w-md mx-auto transition-colors duration-300">
        <BookOpen className="h-20 w-20 text-theme-muted mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-theme-secondary mb-3">
          {BOOK_CONSTANTS.NO_BOOKS_TITLE}
        </h3>
        <p className="text-theme-muted mb-8">
          {hasActiveFilters
            ? BOOK_CONSTANTS.NO_BOOKS_MESSAGE
            : "Coba sesuaikan kriteria pencarian Anda"}
        </p>
        {hasActiveFilters && (
          <button
            onClick={handleResetAllFilters}
            className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            {BOOK_CONSTANTS.VIEW_ALL_BOOKS}
          </button>
        )}
      </div>
    </div>
  );

  const renderBooksGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: BOOK_CONSTANTS.SKELETON_ITEMS_COUNT }).map(
            (_, index) => (
              <BookSkeleton key={index} />
            )
          )}
        </div>
      );
    }

    if (books.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
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

        {/* Search & Filter Section */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-theme-muted" />
              <input
                type="text"
                placeholder={BOOK_CONSTANTS.SEARCH_PLACEHOLDER}
                value={tempSearchTerm}
                onChange={handleInputChange}
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

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Genre Filter */}
              {renderGenreFilter()}

              {/* Clear Genre Filter */}
              {searchState.selectedGenre && (
                <button
                  onClick={clearGenreFilter}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {renderSearchStats()}

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
        {renderBooksGrid()}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default IndonesianBookList;
