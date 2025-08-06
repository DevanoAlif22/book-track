import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import BookFavoritePage from "./pages/BookFavoritePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearcPage from "./pages/SearcPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/home" element={<HomePage></HomePage>} />
        <Route path="/search" element={<SearcPage></SearcPage>} />
        <Route
          path="/detail/:bookId"
          element={<BookDetailPage></BookDetailPage>}
        />
        <Route
          path="/favorites"
          element={<BookFavoritePage></BookFavoritePage>}
        />

        {/* not found */}
        <Route path="*" element={<NotFoundPage></NotFoundPage>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
