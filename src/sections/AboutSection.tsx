import React, { useEffect } from "react";
import { BookOpen, Globe, Users, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-out",
      once: true,
      offset: 100,
    });
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Koleksi Luas",
      description:
        "Temukan ribuan buku dari berbagai genre dan bahasa yang sesuai dengan preferensi membaca Anda.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Baca di Mana Saja",
      description:
        "Akses buku favorit Anda kapan saja, di mana saja, dari perangkat apa pun yang terhubung ke internet.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Komunitas",
      description:
        "Bergabunglah dengan komunitas pembaca yang terus berkembang, bagikan pemikiran, dan jelajahi rekomendasi dari sesama pecinta buku.",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="relative bg-theme-secondary overflow-hidden transition-all duration-500">
      {/* Elemen Latar Animasi */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
        {/* Bagian Judul */}
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 bg-theme-card backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-theme-primary mb-6 border border-theme"
            data-aos="fade-down"
            data-aos-delay="0"
          >
            <Sparkles className="w-4 h-4" />
            Tentang Book Track
          </div>

          <h2
            className="text-5xl md:text-6xl font-bold text-theme-primary text-transparent mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Alam Semesta Literasi
            <br />
            <span className="text-3xl md:text-4xl font-semibold">
              Menunggu Anda
            </span>
          </h2>

          <p
            className="text-xl text-theme-secondary max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Selamat datang di{" "}
            <span className="font-bold text-transparent text-theme-primary">
              Book Track
            </span>{" "}
            — perpustakaan online terbaik Anda. Kami menyediakan koleksi buku
            pilihan dari berbagai genre, mulai dari karya klasik abadi hingga
            buku terlaris terbaru. Misi kami adalah membuat membaca menjadi
            lebih mudah diakses dan menyenangkan untuk semua orang.
          </p>
        </div>

        {/* Kartu Fitur */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-theme-card backdrop-blur-sm rounded-3xl p-8 hover:bg-theme-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 border border-theme"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              {/* Efek Border Gradient */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              >
                <div className="w-full h-full bg-theme-card rounded-3xl"></div>
              </div>

              {/* Konten */}
              <div className="relative z-10">
                {/* Ikon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-theme-primary mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-theme-secondary leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Panah Hover */}
                <div className="flex items-center text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-sm font-medium mr-2">
                    Pelajari lebih lanjut
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <Link to="/search">
          <div className="text-center" data-aos="zoom-in" data-aos-delay="700">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 cursor-pointer">
              <BookOpen className="w-6 h-6" />
              Mulai Perjalanan Membaca Anda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default AboutSection;
