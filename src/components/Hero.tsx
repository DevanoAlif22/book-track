import React, { useState, useEffect } from "react";
import { BookOpen, Star, TrendingUp, Users, Award } from "lucide-react";
import { Link } from "react-router";

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: BookOpen, label: "Koleksi Buku", value: "2,000+" },
    { icon: Users, label: "Pembaca Aktif", value: "5,000+" },
    { icon: Star, label: "Rating Rata-rata", value: "4.8/5" },
    { icon: Award, label: "Buku Terpilih", value: "1,500+" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&h=900&fit=crop"
            alt="Latar Buku"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-indigo-900/70"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/15 rounded-full animate-bounce slow-bounce"></div>
        <div className="absolute bottom-32 left-20 w-16 h-16 bg-purple-500/25 rounded-full animate-pulse delay-1000"></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-5 lg:py-12 z-10">
        <div className="text-center mb-12">
          {/* Animated Title */}
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                Temukan Buku
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Favorit Anda
              </span>
            </h1>
          </div>

          {/* Animated Subtitle */}
          <div
            className={`transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Jelajahi{" "}
              <span className="text-blue-300 font-semibold">ribuan buku</span>{" "}
              dari karya klasik hingga bestseller terbaru.
              <span className="text-indigo-300">
                {" "}
                Membaca belum pernah semenyenangkan ini.
              </span>
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`transition-all duration-1000 delay-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center group cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group-hover:bg-white/15">
                    <IconComponent className="h-8 w-8 text-blue-400 mx-auto mb-3 group-hover:text-blue-300 transition-colors duration-300" />
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:text-blue-100 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-1200 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <Link to="/search">
                  <span>Jelajahi Koleksi</span>
                </Link>
              </span>
            </button>
            <button
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const section = document.getElementById("popular");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Buku Terpopuler</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
