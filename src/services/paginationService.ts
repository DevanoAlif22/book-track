// 2. services/paginationService.ts
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class PaginationService {
  static generatePageNumbers(
    currentPage: number,
    totalPages: number
  ): (number | string)[] {
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Show ellipsis after first page if needed
    if (currentPage > 4) {
      pages.push("...");
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Show ellipsis before last page if needed
    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    // Always show last page (if more than 1 page total)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  static isValidPageChange(
    newPage: number,
    currentPage: number,
    totalPages: number
  ): boolean {
    return newPage !== currentPage && newPage >= 1 && newPage <= totalPages;
  }
}
