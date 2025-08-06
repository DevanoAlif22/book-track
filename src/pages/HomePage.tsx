// import { Link } from "react-router-dom";
import AboutSection from "../sections/AboutSection";
import Hero from "../components/Hero";
import BookPopularSection from "../sections/BookPopularSection";
import ReviewSection from "../sections/ReviewSection";

const HomePage = () => {
  return (
    <div>
      <div className="">
        <Hero />
        <AboutSection />
        <BookPopularSection />
        <ReviewSection />
      </div>
    </div>
  );
};

export default HomePage;
