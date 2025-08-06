import React from "react";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 transition-all duration-500">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 transition-colors duration-300">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Oops! Sepertinya halaman yang Anda cari sedang hilang atau mungkin
            tidak pernah ada. Mari kembali ke perpustakaan digital dan temukan
            buku-buku menarik lainnya.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => (window.location.href = "/home")}
              className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Kembali ke Beranda</span>
            </button>

            <button
              onClick={() => (window.location.href = "/search")}
              className="flex items-center space-x-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600 transform hover:scale-105 font-medium"
            >
              <Search className="h-5 w-5" />
              <span>Cari Buku</span>
            </button>
          </div>

          {/* Go Back Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke halaman sebelumnya</span>
            </button>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            💡 Tahukah Anda? Error 404 pertama kali muncul di CERN tahun 1992
          </p>
        </div>
      </div>

      {/* Floating Books Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-blue-200 dark:text-blue-900 opacity-20 animate-pulse">
          <BookOpen className="h-8 w-8 transform rotate-12" />
        </div>
        <div className="absolute top-32 right-20 text-purple-200 dark:text-purple-900 opacity-20 animate-bounce delay-100">
          <BookOpen className="h-6 w-6 transform -rotate-12" />
        </div>
        <div className="absolute bottom-32 left-20 text-blue-200 dark:text-blue-900 opacity-20 animate-pulse delay-300">
          <BookOpen className="h-10 w-10 transform rotate-45" />
        </div>
        <div className="absolute bottom-20 right-10 text-purple-200 dark:text-purple-900 opacity-20 animate-bounce delay-500">
          <BookOpen className="h-7 w-7 transform -rotate-6" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
