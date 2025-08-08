import React from "react";

interface BookSkeletonProps {
  index: number;
}

const BookSkeleton: React.FC<BookSkeletonProps> = ({ index }) => (
  <div
    className="bg-theme-card rounded-xl shadow-lg overflow-hidden animate-pulse border border-theme transition-colors duration-300"
    data-aos="fade-up"
    data-aos-delay={index * 100}
  >
    <div className="h-72 bg-gray-300 dark:bg-gray-600"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-3"></div>
      {/* ... skeleton content */}
    </div>
  </div>
);

export default BookSkeleton;
