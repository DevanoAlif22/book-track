import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import BookFavoritePage from "./pages/BookFavoritePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearcPage from "./pages/SearcPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-primary">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearcPage />} />
          <Route path="/detail/:bookId" element={<BookDetailPage />} />
          <Route path="/favorites" element={<BookFavoritePage />} />

          {/* not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
