"use client";
import React, { useState, useEffect } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.log("Fetch gallery failed:", err));
  }, []);

  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Photo <span style={{ color: "var(--color-primary)" }}>Gallery</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Visual chronicle of struggles, sports meets, rescue aids, and campus assemblies.</p>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div className="gallery-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {images.map((img) => (
              <div key={img.id} className="gallery-item">
                <img src={img.src} alt={img.alt} />
                <div className="gallery-item-overlay">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
