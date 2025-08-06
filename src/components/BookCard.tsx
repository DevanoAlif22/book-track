import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Calendar,
  BookOpen,
  Tag,
  ExternalLink,
  Heart,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: { name: string };
  category: { name: string };
  cover_image: string;
  details: {
    price: string;
    published_date: string;
    total_pages: string;
  };
  tags: { name: string }[];
  summary: string;
  buy_links: { url: string; store: string }[];
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: Book) => fav._id === book._id));
  }, [book._id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav: Book) => fav._id !== book._id);
    } else {
      updatedFavorites = [...favorites, book];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  };

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const formatPrice = (price: string) =>
    price.replace("Rp ", "").replace(",", ".");

  const getPageCount = (pages: string) => pages.replace(" pages", "");

  return (
    <div className="bg-theme-card rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-theme">
      <div className="relative overflow-hidden">
        <img
          src={book.cover_image || "/placeholder.svg"}
          alt={book.title}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) =>
            (e.currentTarget.src =
              "https://via.placeholder.com/300x400/f3f4f6/9ca3af?text=No+Image")
          }
        />

        {/* Tombol Favorite */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-theme-card shadow hover:bg-theme-secondary transition"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-theme-muted"
            }`}
          />
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tombol Lihat Detail */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/detail/${book._id}`}
            className="bg-theme-card backdrop-blur-sm text-theme-primary px-6 py-3 rounded-lg font-semibold hover:bg-theme-secondary transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <BookOpen className="h-5 w-5" />
            <span>Lihat Detail</span>
          </Link>
        </div>

        {book.category.name && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              {book.category.name}
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {formatPrice(book.details.price)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-theme-primary mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer leading-tight">
          {truncateText(book.title, 50)}
        </h3>

        <div className="flex items-center space-x-2 text-theme-secondary mb-3">
          <User className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">{book.author.name}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-theme-muted" />
            <span className="text-sm text-theme-secondary">
              {book.details.published_date}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4 text-theme-muted" />
            <span className="text-sm text-theme-secondary">
              {getPageCount(book.details.total_pages)}
            </span>
          </div>
        </div>

        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {book.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-theme-secondary text-theme-secondary px-2 py-1 rounded-full text-xs flex items-center space-x-1"
              >
                <Tag className="h-3 w-3" />
                <span>{tag.name}</span>
              </span>
            ))}
            {book.tags.length > 3 && (
              <span className="bg-theme-secondary text-theme-secondary px-2 py-1 rounded-full text-xs">
                +{book.tags.length - 3} lainnya
              </span>
            )}
          </div>
        )}

        <p className="text-theme-secondary text-sm leading-relaxed mb-4">
          {truncateText(book.summary, 120)}
        </p>

        {book.buy_links.length > 0 && (
          <a
            href={book.buy_links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-theme-secondary text-sm font-medium transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{book.buy_links[0].store}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default BookCard;
