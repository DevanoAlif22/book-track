import type { Book, TagType } from "../types/BookType";

export const sanitizeBook = (book: Book): Book | null => {
  try {
    if (!book || !book._id || !book.title) {
      console.warn("Invalid book data:", book);
      return null;
    }
    const normalizeTag = (
      tag: TagType | string
    ): { name: string; url: string } => {
      if (typeof tag === "string") {
        return { name: tag, url: "" };
      }
      return {
        name: tag.name || "",
        url: tag.url || "",
      };
    };
    return {
      _id: book._id,
      title: book.title || "Judul tidak tersedia",
      author: {
        name: book.author?.name || "Penulis tidak diketahui",
        url: book.author?.url || "",
      },
      category: {
        name: book.category?.name || "Kategori tidak tersedia",
        url: book.category?.url || "",
      },
      cover_image: book.cover_image || book.coverImage || "",
      details: {
        no_gm: book.details?.no_gm || book.no_gm || "",
        isbn: book.details?.isbn || book.isbn || "",
        price:
          book.details?.price ||
          (typeof book.price === "number"
            ? book.price.toString()
            : book.price) ||
          "0",
        total_pages:
          book.details?.total_pages ||
          (book.pageCount ? `${book.pageCount} pages` : "0 pages"),
        size: book.details?.size || "",
        published_date:
          book.details?.published_date ||
          (book.publishedYear
            ? book.publishedYear.toString()
            : new Date().getFullYear().toString()),
        format: book.details?.format || "",
      },
      tags: Array.isArray(book.tags) ? book.tags.map(normalizeTag) : [],
      summary: book.summary || book.description || "Deskripsi tidak tersedia",
      buy_links: Array.isArray(book.buy_links)
        ? book.buy_links.map((link) => ({
            store: link.store || "Toko Online",
            url: link.url || "",
          }))
        : [],
      publisher: book.publisher || "Penerbit tidak diketahui",
      description:
        book.description || book.summary || "Deskripsi tidak tersedia",
      coverImage: book.coverImage || book.cover_image || "",
      publishedYear: book.publishedYear || new Date().getFullYear(),
      isbn: book.isbn || book.details?.isbn || "",
      pageCount:
        book.pageCount ||
        (book.details?.total_pages
          ? parseInt(book.details.total_pages.replace(" pages", ""))
          : 0),
      language: book.language || "Indonesia",
      rating: book.rating || 0,
      reviewCount: book.reviewCount || 0,
      price:
        typeof book.price === "number"
          ? book.price
          : parseInt((book.details?.price || "0").replace(/[^\d]/g, "")),
      availability: book.availability !== undefined ? book.availability : true,
      createdAt: book.createdAt || new Date().toISOString(),
      updatedAt: book.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sanitizing book:", error, book);
    return null;
  }
};
