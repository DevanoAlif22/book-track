import React from "react";
import { Link } from "react-router-dom";
import { Book, Github, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Info Perusahaan */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Book className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">BookTrack</span>
              </div>
              <p className="text-gray-300 dark:text-gray-400 mb-4 max-w-md">
                Teman pelacak buku pribadi Anda. Temukan buku baru, atur daftar
                bacaan, dan jangan pernah kehilangan jejak perjalanan literasi
                Anda.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/github"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Github className="h-6 w-6" />
                </Link>
                <Link
                  to="/kontak"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Mail className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Tautan Cepat */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2">
                {[
                  { name: "Beranda", path: "/home" },
                  { name: "Pencarian", path: "/search" },
                  { name: "Favorit Saya", path: "/favorites" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dukungan */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2">
                {[
                  { name: "Pusat Bantuan", path: "/home" },
                  { name: "Hubungi Kami", path: "/home" },
                  { name: "Kebijakan Privasi", path: "/home" },
                  { name: "Syarat & Ketentuan", path: "/home" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bawah */}
          <div className="border-t border-gray-700 dark:border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                © 2025 BookTrack. Hak cipta dilindungi.
              </p>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  Surabaya, Jawa Timur, Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
