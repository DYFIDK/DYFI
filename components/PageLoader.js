"use client";
import React, { useState, useEffect } from "react";

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the loader once the page is fully mounted and ready
    const handleLoad = () => {
      setLoading(false);
    };

    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
      
      // Safety fallback timeout to prevent stuck loading screen
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="global-loader-container">
        <div className="thin-arc-spinner"></div>
      </div>
    );
  }

  return <>{children}</>;
}
