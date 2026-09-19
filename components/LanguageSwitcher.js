"use client";
import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

// External store subscription for client-side mounting
const emptySubscribe = () => () => {};

// External store subscription for active language
const langListeners = new Set();
const notifyLangChange = () => {
  langListeners.forEach((listener) => listener());
};

const langSubscribe = (callback) => {
  langListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    langListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
};

const getLangSnapshot = () => {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(^|;\s*)googtrans=([^;]*)/);
  if (match && match[2] && match[2].includes("/kn")) return "kn";
  if (typeof window !== "undefined" && localStorage.getItem("dyfi_lang") === "kn") return "kn";
  return "en";
};

const getLangServerSnapshot = () => "en";

export default function LanguageSwitcher({ className = "" }) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const currentLang = useSyncExternalStore(langSubscribe, getLangSnapshot, getLangServerSnapshot);
  const pathname = usePathname();

  // Helper to set cookie for all relevant scopes
  const setCookie = (name, value, days) => {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    const domain = window.location.hostname;
    
    document.cookie = `${name}=${value}${expires}; path=/;`;
    document.cookie = `${name}=${value}${expires}; path=/; domain=${domain};`;
    if (domain.includes(".") && !domain.startsWith(".")) {
      document.cookie = `${name}=${value}${expires}; path=/; domain=.${domain};`;
    }
  };

  // Helper to clear cookie
  const deleteCookie = (name) => {
    if (typeof document === "undefined") return;
    const domain = window.location.hostname;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    if (domain.includes(".") && !domain.startsWith(".")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    }
  };

  // Monitor Google Translate select element and ensure Kannada applies on route change
  useEffect(() => {
    if (!isClient) return;
    if (currentLang === "kn") {
      const applyKannada = () => {
        const combo = document.querySelector(".goog-te-combo");
        if (combo && combo.value !== "kn") {
          combo.value = "kn";
          combo.dispatchEvent(new Event("change"));
        }
      };

      const timer = setTimeout(applyKannada, 400);
      return () => clearTimeout(timer);
    }
  }, [pathname, currentLang, isClient]);

  const switchLanguage = (lang) => {
    if (lang === currentLang) return;

    if (lang === "kn") {
      // Switch to Kannada
      setCookie("googtrans", "/en/kn", 30);
      localStorage.setItem("dyfi_lang", "kn");
      notifyLangChange();

      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = "kn";
        combo.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
    } else {
      // Switch back to English
      deleteCookie("googtrans");
      setCookie("googtrans", "/en/en", 30);
      localStorage.setItem("dyfi_lang", "en");
      notifyLangChange();

      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = "en";
        combo.dispatchEvent(new Event("change"));
      }
      // Clean reload to completely reset translated DOM nodes
      window.location.reload();
    }
  };

  if (!isClient) {
    return (
      <div className={`dyfi-lang-switcher ${className}`} aria-label="Language Selector">
        <div className="dyfi-lang-pill">
          <span className="dyfi-lang-opt active">English</span>
          <span className="dyfi-lang-divider">|</span>
          <span className="dyfi-lang-opt">ಕನ್ನಡ</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`dyfi-lang-switcher ${className}`} aria-label="Language Selector">
      <div className="dyfi-lang-pill">
        <i className="bi bi-translate dyfi-lang-icon" title="ಭಾಷೆ ಬದಲಾಯಿಸಿ / Change Language"></i>
        <button
          type="button"
          onClick={() => switchLanguage("en")}
          className={`dyfi-lang-btn ${currentLang === "en" ? "active" : ""}`}
          title="English"
          aria-pressed={currentLang === "en"}
        >
          English
        </button>
        <span className="dyfi-lang-divider">|</span>
        <button
          type="button"
          onClick={() => switchLanguage("kn")}
          className={`dyfi-lang-btn ${currentLang === "kn" ? "active" : ""}`}
          title="ಕನ್ನಡ (Kannada)"
          aria-pressed={currentLang === "kn"}
        >
          ಕನ್ನಡ
        </button>
      </div>
    </div>
  );
}
