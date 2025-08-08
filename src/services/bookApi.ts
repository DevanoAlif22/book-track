// services/bookApi.ts
import axios, { type AxiosResponse } from "axios";
import type { Book } from "../types/BookType";

// Base URL untuk API
const BASE_URL = "https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1";

// Konfigurasi axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 detik timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface untuk response API
export interface ApiResponse {
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

// Interface untuk parameter pencarian - UPDATED dengan genre
export interface SearchParams {
  page?: number;
  keyword?: string;
  sort?: "asc" | "desc";
  category?: string;
  author?: string;
  genre?: string; // Added genre parameter
}

export interface GenreStatistic {
  count: number;
  genre: string | null;
}

// Interface untuk response genre API
export interface GenreApiResponse {
  genre_statistics: GenreStatistic[];
  total_genres: number;
}

// Interceptor untuk request
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor untuk response
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.data || error.message);

    // Handle different error types
    if (error.response?.status === 404) {
      throw new Error("Data tidak ditemukan");
    } else if (error.response?.status === 500) {
      throw new Error("Server sedang bermasalah. Silakan coba lagi nanti");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Periksa koneksi internet Anda");
    } else {
      throw new Error("Terjadi kesalahan saat mengambil data");
    }
  }
);

// Service class untuk book API
export class BookApiService {
  /**
   * Mengambil daftar buku dengan parameter pencarian - UPDATED
   */
  static async getBooks(params: SearchParams = {}): Promise<ApiResponse> {
    try {
      const searchParams = new URLSearchParams();

      // Set default values
      searchParams.append("sort", params.sort || "desc");
      searchParams.append("page", (params.page || 1).toString());

      // Add optional parameters
      if (params.keyword?.trim()) {
        searchParams.append("keyword", params.keyword.trim());
      }

      if (params.category?.trim()) {
        searchParams.append("category", params.category.trim());
      }

      if (params.author?.trim()) {
        searchParams.append("author", params.author.trim());
      }

      // ADD GENRE PARAMETER - This was missing!
      if (params.genre?.trim()) {
        searchParams.append("genre", params.genre.trim());
      }

      const response = await api.get<ApiResponse>(
        `/book?${searchParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in getBooks:", error);
      throw error;
    }
  }

  /**
   * Mengambil statistik genre buku
   */
  static async getGenres(): Promise<GenreApiResponse> {
    try {
      const response = await api.get<GenreApiResponse>("/stats/genre");
      return response.data;
    } catch (error) {
      console.error("Error in getGenres:", error);
      throw error;
    }
  }

  /**
   * Mengambil statistik genre buku popular
   */
  static async getPopularGenres(limit?: number): Promise<GenreStatistic[]> {
    try {
      const genreData = await this.getGenres();

      // Filter genre yang null dan urutkan berdasarkan count (descending)
      let genres = genreData.genre_statistics
        .filter((genre) => genre.genre !== null)
        .sort((a, b) => b.count - a.count);

      // Batasi jumlah hasil jika limit diberikan
      if (limit && limit > 0) {
        genres = genres.slice(0, limit);
      }

      return genres;
    } catch (error) {
      console.error("Error in getPopularGenres:", error);
      throw error;
    }
  }

  /**
   * Mengambil detail buku berdasarkan ID
   */
  static async getBookById(bookId: string): Promise<Book> {
    try {
      if (!bookId) {
        throw new Error("Book ID diperlukan");
      }

      const response = await api.get<Book>(`/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error in getBookById:", error);
      throw error;
    }
  }

  /**
   * Mencari buku berdasarkan kata kunci
   */
  static async searchBooks(
    keyword: string,
    page: number = 1,
    sort: "asc" | "desc" = "desc"
  ): Promise<ApiResponse> {
    return this.getBooks({ keyword, page, sort });
  }

  /**
   * Mengambil buku berdasarkan kategori
   */
  static async getBooksByCategory(
    category: string,
    page: number = 1
  ): Promise<ApiResponse> {
    return this.getBooks({ category, page });
  }

  /**
   * Mengambil buku berdasarkan penulis
   */
  static async getBooksByAuthor(
    author: string,
    page: number = 1
  ): Promise<ApiResponse> {
    return this.getBooks({ author, page });
  }

  /**
   * NEW: Mengambil buku berdasarkan genre
   */
  static async getBooksByGenre(
    genre: string,
    page: number = 1,
    sort: "asc" | "desc" = "desc"
  ): Promise<ApiResponse> {
    return this.getBooks({ genre, page, sort });
  }

  /**
   * NEW: Mencari buku dengan multiple filters
   */
  static async searchBooksAdvanced(filters: {
    keyword?: string;
    genre?: string;
    category?: string;
    author?: string;
    page?: number;
    sort?: "asc" | "desc";
  }): Promise<ApiResponse> {
    return this.getBooks(filters);
  }

  /**
   * Mengambil buku terbaru
   */
  static async getLatestBooks(page: number = 1): Promise<ApiResponse> {
    return this.getBooks({ page, sort: "desc" });
  }

  /**
   * Mengambil buku dengan paginasi
   */
  static async getBooksWithPagination(page: number): Promise<ApiResponse> {
    const params: SearchParams = { page };
    return this.getBooks(params);
  }
}

// Export default untuk kemudahan import
export default BookApiService;

// Utility functions untuk error handling
export const handleApiError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response &&
    typeof (
      (error as { response: { data?: unknown } }).response as { data?: unknown }
    ).data === "object" &&
    ((error as { response: { data?: unknown } }).response as { data?: unknown })
      .data !== null &&
    typeof (
      (
        (error as { response: { data?: unknown } }).response as {
          data?: unknown;
        }
      ).data as { message?: unknown }
    ).message === "string"
  ) {
    return (
      (
        (error as { response: { data?: unknown } }).response as {
          data?: unknown;
        }
      ).data as { message: string }
    ).message;
  }

  return "Terjadi kesalahan yang tidak diketahui";
};

// Type guards
export const isApiResponse = (data: unknown): data is ApiResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as ApiResponse).books) &&
    (data as ApiResponse).pagination &&
    typeof (data as ApiResponse).pagination.currentPage === "number"
  );
};

export const isBook = (data: unknown): data is Book => {
  return (
    typeof data === "object" &&
    data !== null &&
    "_id" in data &&
    typeof (data as { _id: unknown })._id === "string" &&
    "title" in data &&
    typeof (data as { title: unknown }).title === "string" &&
    "author" in data &&
    typeof (data as { author: unknown }).author === "object" &&
    (data as { author: unknown }).author !== null &&
    typeof (data as { author: { name: unknown } }).author.name === "string"
  );
};

// Type guard untuk Genre API Response
export const isGenreApiResponse = (data: unknown): data is GenreApiResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as GenreApiResponse).genre_statistics) &&
    typeof (data as GenreApiResponse).total_genres === "number"
  );
};

// Type guard untuk Genre Statistic
export const isGenreStatistic = (data: unknown): data is GenreStatistic => {
  return (
    typeof data === "object" &&
    data !== null &&
    "count" in data &&
    typeof (data as { count: unknown }).count === "number" &&
    "genre" in data &&
    (typeof (data as { genre: unknown }).genre === "string" ||
      (data as { genre: unknown }).genre === null)
  );
};
