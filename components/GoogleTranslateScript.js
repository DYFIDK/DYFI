"use client";
import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Define the init callback before loading the script
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "kn",
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch (e) {
          console.error("Google Translate Init error:", e);
        }
      }
    };

    // If script already loaded, just init
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // Inject script only once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* Hidden div where Google Translate widget mounts */}
      <div id="google_translate_element" style={{ display: "none" }} />
    </>
  );
}
