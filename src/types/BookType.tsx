// BookType.ts - Corrected version
export interface Author {
  name: string;
  url?: string;
}

export interface Category {
  name: string;
  url?: string;
}

export interface BookDetails {
  no_gm?: string;
  isbn?: string;
  price: string;
  total_pages: string;
  size?: string;
  published_date: string;
  format?: string;
}

export interface TagType {
  name: string;
  url?: string;
}

export interface BuyLink {
  store: string;
  url: string;
}

// Main Book interface that matches what BookCard expects
export interface Book {
  _id: string;
  title: string;
  author: Author;
  category: Category;
  cover_image: string; // This should match the API response
  details: BookDetails;
  tags: TagType[];
  summary: string;
  buy_links: BuyLink[];

  // Additional properties used in BookListSection
  description?: string;
  coverImage?: string; // Alternative property name
  publishedYear?: number;
  isbn?: string;
  pageCount?: number;
  language?: string;
  publisher?: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  availability?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
