// 5. hooks/useBookSearch.ts (Custom Hook)
import { useState, useEffect, useCallback } from "react";
import {
  BookSearchService,
  type BookSearchResult,
} from "../services/bookSearchService";
import {
  SearchStateService,
  type SearchState,
} from "../services/searchStateService";
import { ErrorService } from "../services/errorService";
import type { GenreStatistic } from "../services/bookApi";

export const useBookSearch = () => {
  const [searchResult, setSearchResult] = useState<BookSearchResult | null>(
    null
  );
  const [searchState, setSearchState] = useState<SearchState>(
    SearchStateService.createInitialState()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [genres, setGenres] = useState<GenreStatistic[]>([]);
  const [genresLoading, setGenresLoading] = useState<boolean>(true);

  const fetchBooks = useCallback(async (state: SearchState) => {
    setLoading(true);
    setError("");

    try {
      const result = await BookSearchService.searchBooks({
        page: state.currentPage,
        keyword: state.searchTerm,
        genre: state.selectedGenre,
      });

      setSearchResult(result);
    } catch (err) {
      setError(ErrorService.handleBookSearchError(err));
      setSearchResult({ books: [], pagination: null } as never);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGenres = useCallback(async () => {
    try {
      setGenresLoading(true);
      const genreData = await BookSearchService.getGenres(20);
      setGenres(genreData);
    } catch (err) {
      ErrorService.handleGenreError(err);
    } finally {
      setGenresLoading(false);
    }
  }, []);

  // Actions
  const updateSearchTerm = useCallback(
    (term: string) => {
      const newState = SearchStateService.updateSearchTerm(searchState, term);
      setSearchState(newState);
    },
    [searchState]
  );

  const updateGenre = useCallback(
    (genre: string) => {
      const newState = SearchStateService.updateGenre(searchState, genre);
      setSearchState(newState);
    },
    [searchState]
  );

  const updatePage = useCallback(
    (page: number) => {
      const newState = SearchStateService.updatePage(searchState, page);
      setSearchState(newState);
    },
    [searchState]
  );

  const resetFilters = useCallback(() => {
    const newState = SearchStateService.resetToDefault();
    setSearchState(newState);
  }, []);

  const performSearch = useCallback(() => {
    fetchBooks(searchState);
  }, [searchState, fetchBooks]);

  // Effects
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    fetchBooks(searchState);
  }, [searchState, fetchBooks]);

  return {
    // State
    books: searchResult?.books || [],
    pagination: searchResult?.pagination || null,
    searchState,
    loading,
    error,
    genres,
    genresLoading,

    // Actions
    updateSearchTerm,
    updateGenre,
    updatePage,
    resetFilters,
    performSearch,

    // Computed
    hasActiveFilters: SearchStateService.hasActiveFilters(searchState),
    filterDescription: SearchStateService.getFilterDescription(searchState),
  };
};
