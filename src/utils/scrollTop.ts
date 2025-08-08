import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll ke atas setiap ganti route
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // Komponen ini tidak render apapun
};

export default ScrollToTop;
