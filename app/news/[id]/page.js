"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewsArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const published = Array.isArray(data) ? data.filter((n) => !n.status || String(n.status).toLowerCase() !== "draft") : [];
        const found = published.find((n) => String(n.id) === String(id));
        setArticle(found || null);
        // Get up to 3 related articles (excluding current)
        setRelatedNews(published.filter((n) => String(n.id) !== String(id)).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main>
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-light)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }}></div>
            <p style={{ color: "#475569", fontSize: "1rem" }}>Loading article...</p>
          </div>
        </section>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!article) {
    return (
      <main>
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-light)", flexDirection: "column", gap: "1.5rem" }}>
          <i className="bi bi-newspaper" style={{ fontSize: "4rem", color: "#cbd5e1" }}></i>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a" }}>Article Not Found</h2>
          <p style={{ color: "#64748b", maxWidth: "400px", textAlign: "center" }}>The news article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/news" style={{ background: "var(--color-primary)", color: "white", padding: "0.7rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", transition: "all 0.2s ease" }}>
            ← Back to News
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Banner */}
      <section style={{
        background: article.image
          ? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(15,23,42,0.95)), url('${article.image}') center/cover no-repeat`
          : "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)",
        padding: "clamp(6rem, 12vw, 9rem) 1.5rem 3.5rem",
        textAlign: "center",
        color: "white",
        position: "relative"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1.25rem", fontSize: "0.75rem", opacity: 0.85, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}><i className="bi bi-calendar3" style={{ fontSize: "0.75rem" }}></i>{article.date}</span>
            {article.views && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}><i className="bi bi-eye" style={{ fontSize: "0.75rem" }}></i>{article.views} views</span>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: "800", lineHeight: 1.25, letterSpacing: "-0.5px", margin: 0 }}>{article.title}</h1>
        </div>
      </section>

      {/* Article Content */}
      <section style={{ background: "var(--color-bg-light)", padding: "3rem 1rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#64748b", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: "0.65rem" }}></i>
            <Link href="/news" style={{ color: "var(--color-primary)", textDecoration: "none" }}>News</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: "0.65rem" }}></i>
            <span style={{ color: "#0f172a", fontWeight: "500", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.title}</span>
          </nav>

          {/* Featured Image */}
          {article.image && (
            <div style={{
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: "100%", height: "auto", display: "block", maxHeight: "420px", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Article Body */}
          <article style={{
            background: "white",
            borderRadius: "14px",
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            lineHeight: 1.8,
            fontSize: "1rem",
            color: "#334155"
          }}>
            {/* Meta Info Bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid #f1f5f9",
              marginBottom: "1.5rem",
              flexWrap: "wrap"
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b", background: "#f8fafc", padding: "0.25rem 0.65rem", borderRadius: "6px" }}>
                <i className="bi bi-calendar3" style={{ fontSize: "0.75rem" }}></i> {article.date}
              </span>
              {article.views && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b", background: "#f8fafc", padding: "0.25rem 0.65rem", borderRadius: "6px" }}>
                  <i className="bi bi-eye" style={{ fontSize: "0.75rem" }}></i> {article.views} views
                </span>
              )}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--color-primary)", background: "rgba(227, 24, 55, 0.08)", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: "600" }}>
                <i className="bi bi-newspaper" style={{ fontSize: "0.75rem" }}></i> DYFI News
              </span>
            </div>

            {/* Content */}
            <div style={{ whiteSpace: "pre-wrap" }}>
              {article.content}
            </div>

            {/* Description if different from content */}
            {article.description && article.description !== article.content && (
              <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "10px", borderLeft: "4px solid var(--color-primary)" }}>
                <p style={{ margin: 0, color: "#475569", fontStyle: "italic" }}>{article.description}</p>
              </div>
            )}
          </article>

          {/* Share / Back Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <Link href="/news" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "white",
              color: "var(--color-primary)",
              padding: "0.7rem 1.5rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.9rem",
              border: "1px solid #e2e8f0",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
            }}>
              <i className="bi bi-arrow-left"></i> Back to News
            </Link>
          </div>

          {/* Related Articles */}
          {relatedNews.length > 0 && (
            <div style={{ marginTop: "4rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginBottom: "1.5rem" }}>
                More <span style={{ color: "var(--color-primary)" }}>News</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {relatedNews.map((n) => (
                  <Link key={n.id} href={`/news/${n.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="news-card" style={{ background: "white", transition: "all 0.3s ease", cursor: "pointer" }}>
                      <div className="news-card-img">
                        {n.image ? (
                          <img src={n.image} alt={n.title} />
                        ) : (
                          <div style={{ width: "100%", height: "200px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="bi bi-newspaper" style={{ fontSize: "2.5rem", color: "#cbd5e1" }}></i>
                          </div>
                        )}
                      </div>
                      <div className="news-card-body">
                        <div className="news-card-date"><i className="bi bi-calendar3"></i> {n.date}</div>
                        <h3>{n.title}</h3>
                        <p style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{n.content}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
