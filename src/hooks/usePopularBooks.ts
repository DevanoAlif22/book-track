import { useState, useCallback } from "react";
import type { Book } from "../types/BookType";
import { BookApiService, handleApiError } from "../services/bookApi";

export const usePopularBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState<number>(8);

  const fetchBooks = useCallback(async (limit: number = 8) => {
    setLoading(true);
    setError("");

    try {
      const data = await BookApiService.getLatestBooks(1);
      const limitedBooks = data.books.slice(0, limit);

      setBooks(limitedBooks);
      setTotalBooks(data.pagination.totalItems);

      return limitedBooks;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching popular books:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleShowLess = useCallback(() => {
    const newCount = Math.max(8, displayCount - 8);
    setDisplayCount(newCount);
    setBooks((prev) => prev.slice(0, newCount));
  }, [displayCount]);

  const retry = useCallback(() => {
    fetchBooks(displayCount);
  }, [fetchBooks, displayCount]);

  return {
    books,
    loading,
    error,
    totalBooks,
    displayCount,
    setDisplayCount,
    fetchBooks,
    handleShowLess,
    retry,
  };
};
