"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherCampaigns, setOtherCampaigns] = useState([]);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        const published = Array.isArray(data) ? data.filter((c) => !c.status || String(c.status).toLowerCase() !== "draft") : [];
        const found = published.find((c) => String(c.id) === String(id));
        setCampaign(found || null);
        setOtherCampaigns(published.filter((c) => String(c.id) !== String(id)).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main>
        <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-light)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid var(--color-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem" }}></div>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Loading campaign...</p>
          </div>
        </section>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main>
        <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-light)", flexDirection: "column", gap: "1.25rem", padding: "2rem" }}>
          <i className="bi bi-flag" style={{ fontSize: "3.5rem", color: "#cbd5e1" }}></i>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a" }}>Campaign Not Found</h2>
          <p style={{ color: "#64748b", maxWidth: "420px", textAlign: "center", fontSize: "0.9rem" }}>The campaign initiative you are looking for does not exist or has concluded.</p>
          <Link href="/campaigns" style={{ background: "var(--color-primary)", color: "white", padding: "0.6rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "0.85rem" }}>
            ← View All Campaigns
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Banner */}
      <section style={{
        background: campaign.image
          ? `linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(15,23,42,0.92)), url('${campaign.image}') center/cover no-repeat`
          : "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)",
        padding: "clamp(6rem, 12vw, 9rem) 1.5rem 3.5rem",
        textAlign: "center",
        color: "white"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Metadata pill badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.25rem" }}>
            {campaign.status && (
              <span style={{
                background: campaign.status === "Published" ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.15)",
                color: campaign.status === "Published" ? "#4ade80" : "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "0.2rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.72rem",
                fontWeight: "600",
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>
                {campaign.status}
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <i className="bi bi-calendar3" style={{ fontSize: "0.75rem" }}></i> {campaign.date}
            </span>
            {campaign.views && (
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <i className="bi bi-eye" style={{ fontSize: "0.75rem" }}></i> {campaign.views} views
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: "800", lineHeight: 1.25, letterSpacing: "-0.5px", margin: 0 }}>
            {campaign.title}
          </h1>
        </div>
      </section>

      {/* Main Campaign Content */}
      <section style={{ background: "var(--color-bg-light)", padding: "3rem 1rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#64748b", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: "0.65rem" }}></i>
            <Link href="/campaigns" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Campaigns</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: "0.65rem" }}></i>
            <span style={{ color: "#0f172a", fontWeight: "500", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{campaign.title}</span>
          </nav>

          {/* Featured Image */}
          {campaign.image && (
            <div style={{ borderRadius: "14px", overflow: "hidden", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <img
                src={campaign.image}
                alt={campaign.title}
                style={{ width: "100%", height: "auto", display: "block", maxHeight: "420px", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Campaign Details Card */}
          <div style={{
            background: "white",
            borderRadius: "14px",
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            lineHeight: 1.8,
            fontSize: "1rem",
            color: "#334155"
          }}>
            {/* Meta bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingBottom: "1.25rem", borderBottom: "1px solid #f1f5f9", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b", background: "#f8fafc", padding: "0.25rem 0.65rem", borderRadius: "6px" }}>
                <i className="bi bi-calendar3" style={{ fontSize: "0.75rem" }}></i> {campaign.date}
              </span>
              {campaign.status && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#15803d", background: "#f0fdf4", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: "600" }}>
                  <i className="bi bi-check-circle" style={{ fontSize: "0.75rem" }}></i> {campaign.status}
                </span>
              )}
              {campaign.views && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b", background: "#f8fafc", padding: "0.25rem 0.65rem", borderRadius: "6px" }}>
                  <i className="bi bi-eye" style={{ fontSize: "0.75rem" }}></i> {campaign.views} views
                </span>
              )}
            </div>

            {/* Campaign Narrative */}
            <div style={{ whiteSpace: "pre-wrap", fontSize: "0.98rem", color: "#334155" }}>
              {campaign.description}
            </div>

            {/* Call to action box */}
            <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(227, 24, 55, 0.04)", borderRadius: "10px", borderLeft: "4px solid var(--color-primary)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", color: "var(--color-primary-dark)" }}>
                Support this movement
              </h4>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                Join the DYFI youth wing in Dakshina Kannada to champion fair opportunities, secular unity, and progressive change.
              </p>
              <div style={{ marginTop: "0.25rem" }}>
                <Link href="/join" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--color-primary)", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "6px", fontSize: "0.82rem", fontWeight: "600", textDecoration: "none" }}>
                  Join DYFI <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation link */}
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <Link href="/campaigns" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "white",
              color: "var(--color-primary)",
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.85rem",
              border: "1px solid #e2e8f0"
            }}>
              <i className="bi bi-arrow-left"></i> Back to Campaigns
            </Link>
          </div>

          {/* Related Campaigns */}
          {otherCampaigns.length > 0 && (
            <div style={{ marginTop: "3.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0f172a", marginBottom: "1.25rem" }}>
                Other Active <span style={{ color: "var(--color-primary)" }}>Campaigns</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.25rem" }}>
                {otherCampaigns.map((c) => (
                  <Link key={c.id} href={`/campaigns/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="campaign-card" style={{ background: "white", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div className="campaign-card-img" style={{ height: "160px" }}>
                        <img src={c.image || "/images/hero-banner-1.jpg"} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div className="campaign-card-body" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#888", marginBottom: "0.4rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-calendar3"></i> {c.date}</span>
                          {c.views && <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><i className="bi bi-eye"></i> {c.views}</span>}
                        </div>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.4rem" }}>{c.title}</h3>
                        <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>
                          {c.description}
                        </p>
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
