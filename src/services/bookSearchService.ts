// 1. services/bookSearchService.ts
import BookApiService, { type GenreStatistic } from "./bookApi";
import type { Book } from "../types/BookType";
import { sanitizeBook } from "../utils/sanitizeBook";

export interface BookSearchParams {
  page?: number;
  keyword?: string;
  genre?: string;
  sort?: string;
}

export interface BookSearchResult {
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

export class BookSearchService {
  static async searchBooks(
    params: BookSearchParams
  ): Promise<BookSearchResult> {
    const { page = 1, keyword = "", genre = "", sort = "desc" } = params;

    const validSort = sort === "asc" || sort === "desc" ? sort : "desc";

    const data = await BookApiService.getBooks({
      page,
      sort: validSort,
      keyword: keyword.trim() || undefined,
      genre: genre.trim() || undefined,
    });

    // Cast dan sanitize books
    const rawBooks = data.books as Book[];
    const sanitizedBooks = rawBooks
      .map(sanitizeBook)
      .filter((book): book is Book => book !== null);

    return {
      books: sanitizedBooks,
      pagination: data.pagination,
    };
  }

  static async getGenres(limit: number = 20): Promise<GenreStatistic[]> {
    return await BookApiService.getPopularGenres(limit);
  }
}
