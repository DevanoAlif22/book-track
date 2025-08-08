import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const ReviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-out",
      once: true,
      offset: 100,
    });
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Sarah Wijaya",
      role: "Mahasiswa Sastra",
      avatar: "SW",
      rating: 5,
      text: "Book Track benar-benar mengubah cara saya membaca! Koleksinya sangat lengkap dan interface-nya sangat user-friendly. Sekarang saya bisa membaca di mana saja tanpa perlu membawa buku fisik.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      name: "Ahmad Rahman",
      role: "Software Engineer",
      avatar: "AR",
      rating: 5,
      text: "Sebagai seseorang yang sibuk dengan pekerjaan, Book Track memberikan kemudahan luar biasa. Fitur sinkronisasi antar device-nya sempurna, saya bisa lanjut baca dari HP ketika perjalanan pulang kerja.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Maya Sari",
      role: "Ibu Rumah Tangga",
      avatar: "MS",
      rating: 5,
      text: "Komunitas di Book Track sangat aktif dan supportive! Saya mendapat banyak rekomendasi buku bagus dari sesama member. Terima kasih Book Track telah menghidupkan kembali passion membaca saya.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Budi Hartono",
      role: "Guru SMA",
      avatar: "BH",
      rating: 5,
      text: "Platform yang luar biasa untuk edukasi! Saya sering merekomendasikan Book Track kepada siswa-siswa saya. Koleksi buku edukatif dan literaturnya sangat membantu dalam proses pembelajaran.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      name: "Linda Kusuma",
      role: "Content Creator",
      avatar: "LK",
      rating: 5,
      text: "Book Track menjadi sumber inspirasi utama untuk konten saya. Fitur highlight dan note-nya memudahkan saya mengumpulkan quote-quote menarik untuk dibagikan ke audience.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      name: "Reza Pratama",
      role: "Entrepreneur",
      avatar: "RP",
      rating: 5,
      text: "Investasi terbaik untuk pengembangan diri! Book Track menyediakan akses mudah ke berbagai buku bisnis dan self-development yang sangat membantu perjalanan karir saya.",
      gradient: "from-teal-500 to-green-500",
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
    );
  };

  const getVisibleReviews = () => {
    const visibleReviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      visibleReviews.push(reviews[index]);
    }
    return visibleReviews;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="relative bg-theme-primary overflow-hidden transition-all duration-500 py-24">
      {/* Elemen Latar Animasi */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bagian Judul */}
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 bg-theme-card backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-theme-primary mb-6 border border-theme"
            data-aos="fade-down"
            data-aos-delay="0"
          >
            <Sparkles className="w-4 h-4" />
            Testimoni Pembaca
          </div>

          <h2
            className="text-5xl md:text-6xl font-bold text-theme-primary text-transparent mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Kata Mereka Tentang
            <br />
            <span className="text-3xl md:text-4xl font-semibold">
              Book Track
            </span>
          </h2>

          <p
            className="text-xl text-theme-secondary max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Bergabunglah dengan ribuan pembaca yang telah merasakan pengalaman
            luar biasa bersama{" "}
            <span className="font-bold text-transparent text-theme-primary bg-clip-text">
              Book Track
            </span>
            . Simak cerita mereka dan temukan mengapa Book Track menjadi pilihan
            utama para pecinta buku.
          </p>
        </div>

        {/* Review Cards dengan Navigation */}
        <div className="relative" data-aos="fade-up" data-aos-delay="300">
          {/* Tombol Navigasi Kiri */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-theme-card backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-theme flex items-center justify-center text-theme-secondary hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Tombol Navigasi Kanan */}
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-theme-card backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl border border-theme flex items-center justify-center text-theme-secondary hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {getVisibleReviews().map((review, index) => (
              <div
                key={`${review.id}-${currentIndex}`}
                className="group relative bg-theme-card backdrop-blur-sm rounded-3xl p-8 hover:bg-theme-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 border border-theme"
                data-aos="fade-up"
                data-aos-delay={500 + index * 100}
              >
                {/* Efek Border Gradient */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${review.gradient} p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                >
                  <div className="w-full h-full bg-theme-card rounded-3xl"></div>
                </div>

                {/* Konten */}
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4 ms-8">
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Text */}
                  <p className="text-theme-secondary leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {review.avatar}
                    </div>

                    {/* Name and Role */}
                    <div>
                      <h4 className="font-bold text-theme-primary">
                        {review.name}
                      </h4>
                      <p className="text-sm text-theme-muted">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
