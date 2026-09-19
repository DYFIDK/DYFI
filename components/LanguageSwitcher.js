"use client";
import { useState, useEffect } from "react";

export default function LanguageSwitcher({ className = "" }) {
  const [isKannada, setIsKannada] = useState(false);

  // Detect current language from cookie on mount
  useEffect(() => {
    const googCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));
    if (googCookie && googCookie.includes("/kn")) {
      setIsKannada(true);
    }
  }, []);

  const setLanguageCookie = (lang) => {
    // Remove old cookie
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=/en/${lang}; path=/`;
  };

  const switchToKannada = () => {
    setLanguageCookie("kn");
    setIsKannada(true);
    // Trigger Google Translate widget to switch
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "kn";
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback: reload so cookie takes effect
      window.location.reload();
    }
  };

  const switchToEnglish = () => {
    setLanguageCookie("en");
    setIsKannada(false);
    // Restore original language
    const iframe = document.querySelector(".goog-te-banner-frame");
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      const restoreBtn = iframeDoc?.querySelector(".goog-te-banner-restore-page");
      if (restoreBtn) {
        restoreBtn.click();
        return;
      }
    }
    window.location.reload();
  };

  return (
    <button
      className={`lang-switcher-btn ${isKannada ? "lang-active" : ""} ${className}`}
      onClick={isKannada ? switchToEnglish : switchToKannada}
      title={isKannada ? "Switch to English" : "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"}
      aria-label="Language Switcher"
    >
      <i className="bi bi-translate dyfi-lang-icon" />
      <span className="lang-label">{isKannada ? "EN" : "ಕನ್ನಡ"}</span>
    </button>
  );
}
