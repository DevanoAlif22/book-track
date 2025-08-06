import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Gambar Latar */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&h=900&fit=crop"
          alt="Latar Buku"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Konten */}
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-28 lg:py-40 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Temukan Buku Favorit Anda Berikutnya
        </h1>
        <p className="text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
          Jelajahi ribuan buku, mulai dari karya klasik abadi hingga buku
          terlaris terbaru. Membaca belum pernah semenyenangkan ini.
        </p>
      </div>
    </section>
  );
};

export default Hero;
