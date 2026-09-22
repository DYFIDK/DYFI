"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Campaigns() {
  const [campaignsList, setCampaignsList] = useState([]);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        const published = Array.isArray(data) ? data.filter((c) => !c.status || String(c.status).toLowerCase() !== "draft") : [];
        setCampaignsList(published);
      })
      .catch((err) => console.log("Fetch campaigns failed:", err));
  }, []);

  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "clamp(6rem, 12vw, 8rem) 1.5rem 3.5rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Our <span style={{ color: "var(--color-primary)" }}>Campaigns</span></h1>
        <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", opacity: 0.85, maxWidth: "600px", margin: "0 auto" }}>Organizing local youth to defend democratic rights, secular values, and fair employment opportunities.</p>
      </section>

      {/* Campaigns Grid Section */}
      <section className="campaigns-section" style={{ background: "var(--color-bg-light)", padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 3vw, 2rem)" }}>
        <div className="campaigns-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="campaigns-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "1.5rem" }}>
            {campaignsList.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="campaign-card" style={{ background: "white", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="campaign-card-img" style={{ height: "200px" }}>
                    <img src={campaign.image || "/images/hero-banner-1.jpg"} alt={campaign.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className="campaign-card-body" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.25rem" }}>
                    {/* Compact metadata bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#888" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                          <i className="bi bi-calendar3" style={{ fontSize: "0.72rem" }}></i> {campaign.date}
                        </span>
                        {campaign.views && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <i className="bi bi-eye" style={{ fontSize: "0.72rem" }}></i> {campaign.views}
                          </span>
                        )}
                      </div>
                      {campaign.status && (
                        <span style={{
                          background: campaign.status === "Published" ? "#f0fdf4" : "#fefce8",
                          color: campaign.status === "Published" ? "#16a34a" : "#ca8a04",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          fontWeight: "600"
                        }}>
                          {campaign.status}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "0.5rem", lineHeight: 1.35 }}>{campaign.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", margin: "0 0 1rem" }}>
                      {campaign.description}
                    </p>
                    <div style={{ marginTop: "auto" }}>
                      <span style={{ color: "var(--color-primary)", fontWeight: "600", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        View Campaign <i className="bi bi-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
