export const POPULAR_BOOKS_CONFIG = {
  DEFAULT_DISPLAY_COUNT: 8,
  MAX_DISPLAY_COUNT: 32,
  MIN_DISPLAY_COUNT: 8,
  INCREMENT_STEP: 8,
} as const;

export const STATS_COLORS = {
  TOTAL_BOOKS: "bg-gradient-to-r from-blue-500 to-blue-600",
  POPULAR_BOOKS: "bg-gradient-to-r from-yellow-500 to-orange-500",
  CATEGORIES: "bg-gradient-to-r from-green-500 to-emerald-500",
} as const;

export const POPULARITY_BADGE_COLORS = {
  FIRST: "bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse",
  SECOND: "bg-gradient-to-r from-gray-400 to-gray-500",
  THIRD: "bg-gradient-to-r from-amber-600 to-amber-700",
} as const;
