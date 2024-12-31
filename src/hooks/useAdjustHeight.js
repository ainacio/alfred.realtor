import { useEffect, useState } from "react";

const useAdjustHeight = ({ navbarHeight = 56, titleRef = null, footerHeight = 0, hideTitle = false }) => {
  const [availableHeight, setAvailableHeight] = useState(0);

  useEffect(() => {
    const adjustHeight = () => {
      const calculatedNavbarHeight = typeof navbarHeight === "number"
        ? navbarHeight
        : document.querySelector(navbarHeight)?.offsetHeight || 56;

      const titleHeight = titleRef?.current && !hideTitle ? titleRef.current.offsetHeight : 0;
      const calculatedHeight = window.innerHeight - calculatedNavbarHeight - titleHeight - footerHeight;

      setAvailableHeight(calculatedHeight);

      // Debugging logs
      console.log("Navbar Height:", calculatedNavbarHeight);
      console.log("Title Height:", titleHeight, "Hide Title:", hideTitle);
      console.log("Available Height:", calculatedHeight);
    };

    adjustHeight(); // Initial adjustment
    window.addEventListener("resize", adjustHeight); // Recalculate on resize

    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, [navbarHeight, titleRef, footerHeight, hideTitle]); // Include navbarHeight in dependencies

  return availableHeight;
};

export default useAdjustHeight;
