"use client";
import React, { useState, useEffect } from "react";

export default function Campaigns() {
  const [campaignsList, setCampaignsList] = useState([]);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaignsList(data))
      .catch((err) => console.log("Fetch campaigns failed:", err));
  }, []);

  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Our <span style={{ color: "var(--color-primary)" }}>Campaigns</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Organizing local youth to defend democratic rights, secular values, and fair employment opportunities.</p>
      </section>

      {/* Campaigns Grid Section */}
      <section className="campaigns-section" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div className="campaigns-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="campaigns-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
            {campaignsList.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-card-img">
                  <img src={campaign.image || "/images/hero-banner-1.jpg"} alt={campaign.title} />
                </div>
                <div className="campaign-card-body">
                  <div className="campaign-card-date"><i className="bi bi-calendar3"></i> {campaign.date}</div>
                  <h3>{campaign.title}</h3>
                  <p>{campaign.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
