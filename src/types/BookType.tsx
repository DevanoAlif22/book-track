export interface Author {
  name: string;
  url: string;
}

export interface Category {
  name: string | null;
  url: string | null;
}

export interface BookDetails {
  no_gm: string;
  isbn: string;
  price: string;
  total_pages: string;
  size: string;
  published_date: string;
  format: string;
}

export interface TagType {
  name: string;
  url: string;
}

export interface BuyLink {
  store: string;
  url: string;
}

export interface Book {
  _id: string;
  title: string;
  cover_image: string;
  author: Author;
  category: Category;
  summary: string;
  details: BookDetails;
  tags: TagType[];
  buy_links: BuyLink[];
  publisher: string;
}
