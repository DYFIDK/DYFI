"use client";
import React, { useState, useEffect } from "react";

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId;
    if (document.readyState === "complete") {
      timeoutId = setTimeout(() => setLoading(false), 0);
    } else {
      const handleLoad = () => setLoading(false);
      window.addEventListener("load", handleLoad);
      timeoutId = setTimeout(() => setLoading(false), 500);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeoutId);
      };
    }
    return () => clearTimeout(timeoutId);
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
