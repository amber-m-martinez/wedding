import { useEffect } from "react";

export const useScrollToHeader = (offset = 60) => {
  useEffect(() => {
    const header = document.querySelector("h4");
    if (header) {
      const headerRect = header.getBoundingClientRect();
      const targetPosition = window.pageYOffset + headerRect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }, [offset]);
};
