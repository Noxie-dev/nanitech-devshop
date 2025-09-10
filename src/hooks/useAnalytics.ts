import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available and we're in a browser environment
    if (typeof window !== "undefined" && (window as any).gtag && location) {
      try {
        (window as any).gtag("config", "G-Z95RLHJ17F", {
          page_path: location.pathname + location.search,
        });
      } catch (error) {
        console.warn("Analytics tracking error:", error);
      }
    }
  }, [location]);
}
