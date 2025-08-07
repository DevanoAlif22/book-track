import React, { useState } from "react";
import {
  Calendar,
  BookOpen,
  User,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import type { Book } from "../types/BookType";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Fallback image generator - menggunakan gradien CSS sebagai placeholder
  const generateFallbackImage = (title: string) => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    ];

    const index = title.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Check if image URL is valid and not a placeholder
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    if (url.includes("placeholder.com")) return false;
    if (url.includes("via.placeholder")) return false;
    return true;
  };

  const shouldShowImage =
    book.cover_image && isValidImageUrl(book.cover_image) && !imageError;

  // Format price
  const formatPrice = (price: string) => {
    if (!price || price === "0") return null;
    // Remove non-numeric characters except decimal point
    const numericPrice = price.replace(/[^\d.]/g, "");
    const priceNum = parseFloat(numericPrice);
    if (isNaN(priceNum)) return null;
    return `Rp ${priceNum.toLocaleString("id-ID")}`;
  };

  // Format published date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.getFullYear().toString();
    } catch {
      return dateStr; // Return original if parsing fails
    }
  };

  const formattedPrice = formatPrice(book.details?.price || "");

  return (
    <div className="bg-theme-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-theme">
      {/* Cover Image atau Fallback */}
      <div className="relative h-72 overflow-hidden">
        {shouldShowImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <img
              src={book.cover_image}
              alt={book.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </>
        ) : (
          // Fallback dengan gradien CSS
          <div
            className="w-full h-full flex items-center justify-center text-white relative"
            style={{ background: generateFallbackImage(book.title) }}
          >
            <div className="text-center p-4">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <h3 className="font-bold text-lg text-center leading-tight line-clamp-3">
                {book.title}
              </h3>
            </div>
            {/* Overlay untuk readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        )}

        {/* Format Badge */}
        {book.details?.format && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {book.details.format}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-theme-primary mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center text-theme-secondary mb-3">
          <User className="h-4 w-4 mr-2" />
          <p className="text-sm">
            {book.author?.name || "Penulis tidak diketahui"}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center mb-4 text-sm text-theme-muted">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(book.details?.published_date || "")}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{book.details?.total_pages || "0"} hal</span>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {book.category?.name && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              {book.category.name}
            </span>
          )}
          {book.tags &&
            book.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {tag.name}
              </span>
            ))}
        </div>

        {/* Summary */}
        <p className="text-theme-muted text-sm mb-4 line-clamp-3">
          {book.summary || "Deskripsi tidak tersedia"}
        </p>

        {/* Publisher & Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-theme-secondary">
            <span className="font-medium">
              {book.publisher || "Publisher tidak diketahui"}
            </span>
          </div>
          {formattedPrice && (
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formattedPrice}
              </p>
            </div>
          )}
        </div>

        {/* Buy Links */}
        {book.buy_links && book.buy_links.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {book.buy_links.slice(0, 2).map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <ShoppingCart className="h-3 w-3" />
                <span>{link.store}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}

        {/* ISBN */}
        {book.details?.isbn && (
          <div className="text-xs text-theme-muted mb-4">
            ISBN: {book.details.isbn}
          </div>
        )}

        {/* Action Button */}
        <button className="w-full mt-4 bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default BookCard;
