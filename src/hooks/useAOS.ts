import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const useAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  const refreshAOS = () => {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  return { refreshAOS };
};
