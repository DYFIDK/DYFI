"use client";
import React, { useState, useEffect } from "react";

export default function Activities() {
  const [activitiesList, setActivitiesList] = useState([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => setActivitiesList(data))
      .catch((err) => console.log("Fetch activities failed:", err));
  }, []);

  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Recent <span style={{ color: "var(--color-primary)" }}>Activities</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Archive of social welfare programs, youth assemblies, and localized relief efforts.</p>
      </section>

      {/* Activities Grid Section */}
      <section className="campaigns-section" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div className="campaigns-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="campaigns-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
            {activitiesList.map((activity) => (
              <div key={activity.id} className="campaign-card">
                <div className="campaign-card-img">
                  <img src={activity.image || "/images/hero-banner-2.jpg"} alt={activity.title} />
                </div>
                <div className="campaign-card-body">
                  <div className="campaign-card-date"><i className="bi bi-calendar3"></i> {activity.date}</div>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
