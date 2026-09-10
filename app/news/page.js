"use client";
import React, { useState, useEffect } from "react";

export default function News() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.log("Fetch news failed:", err));
  }, []);

  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Latest <span style={{ color: "var(--color-primary)" }}>News</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Official press statements, movement highlights, and local bulletins.</p>
      </section>

      {/* News Section */}
      <section className="news-section" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div className="news-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
            {newsList.map((news) => (
              <div key={news.id} className="news-card" style={{ background: "white" }}>
                <div className="news-card-img">
                  <img src={news.image || "/images/hero-banner-1.jpg"} alt={news.title} />
                </div>
                <div className="news-card-body">
                  <div className="news-card-date"><i className="bi bi-calendar3"></i> {news.date}</div>
                  <h3>{news.title}</h3>
                  <p>{news.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
