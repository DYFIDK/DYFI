"use client";
import React, { useState, useEffect } from "react";

export default function Committee() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("/api/committee")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.log("Fetch committee failed:", err));
  }, []);

  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>District <span style={{ color: "var(--color-primary)" }}>Committee</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Leadership body overseeing the democratic youth movement across Dakshina Kannada.</p>
      </section>

      {/* Committee Section */}
      <section className="committee-section" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div className="committee-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="committee-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2.5rem", justifyContent: "center" }}>
            {members.map((member) => (
              <div key={member.id} className="committee-card" style={{ background: "white" }}>
                <div className="committee-card-img">
                  {member.image || member.photo ? (
                    <img 
                      src={member.image || member.photo} 
                      alt={member.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div className="placeholder-avatar"><i className="bi bi-person-fill"></i></div>
                  )}
                </div>
                <h3>{member.role}</h3>
                <p>{member.name}</p>
                {member.area && <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.25rem", display: "block" }}>{member.area}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
