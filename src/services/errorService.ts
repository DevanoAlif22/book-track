import { handleApiError } from "./bookApi";
// 4. services/errorService.ts
export class ErrorService {
  static handleBookSearchError(error: unknown): string {
    console.error("Error fetching books:", error);
    return handleApiError(error);
  }

  static handleGenreError(error: unknown): void {
    console.error("Error fetching genres:", error);
  }
}
