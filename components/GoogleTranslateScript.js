"use client";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Ensure googleTranslateElementInit is globally defined
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,kn",
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
        } catch (e) {
          console.error("Google Translate Init error:", e);
        }
      }
    };

    // If script is already in document, re-trigger
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <>
      {/* Hidden element where Google Translate initializes */}
      <div
        id="google_translate_element"
        style={{ display: "none", position: "absolute", top: "-9999px", left: "-9999px" }}
        aria-hidden="true"
      />
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
