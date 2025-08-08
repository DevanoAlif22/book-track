// 3. services/searchStateService.ts
export interface SearchState {
  searchTerm: string;
  selectedGenre: string;
  currentPage: number;
}

export class SearchStateService {
  static createInitialState(): SearchState {
    return {
      searchTerm: "",
      selectedGenre: "",
      currentPage: 1,
    };
  }

  static resetToDefault(): SearchState {
    return this.createInitialState();
  }

  static updateSearchTerm(state: SearchState, term: string): SearchState {
    return {
      ...state,
      searchTerm: term,
      currentPage: 1, // Reset to first page when searching
    };
  }

  static updateGenre(state: SearchState, genre: string): SearchState {
    return {
      ...state,
      selectedGenre: genre,
      currentPage: 1, // Reset to first page when filtering
    };
  }

  static updatePage(state: SearchState, page: number): SearchState {
    return {
      ...state,
      currentPage: page,
    };
  }

  static hasActiveFilters(state: SearchState): boolean {
    return Boolean(state.searchTerm || state.selectedGenre);
  }

  static getFilterDescription(state: SearchState): string {
    const parts = [];

    if (state.searchTerm) {
      parts.push(`pencarian "${state.searchTerm}"`);
    }

    if (state.selectedGenre) {
      parts.push(`genre "${state.selectedGenre}"`);
    }

    return parts.join(" dan ");
  }
}
