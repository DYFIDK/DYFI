import React from "react";

export const metadata = {
  title: "About Us — DYFI Dakshina Kannada",
  description: "Learn about the history, vision, and social campaigns of the Democratic Youth Federation of India (DYFI) Dakshina Kannada District Committee.",
};

export default function About() {
  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>About <span style={{ color: "var(--color-primary)" }}>Us</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Democratic Youth Federation of India — Dakshina Kannada District Committee.</p>
      </section>

      {/* Main Content */}
      <section className="about-page-content" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "3rem 2.5rem", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.8rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1.5rem" }}>
            Who We Are
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: "1.8", marginBottom: "1.5rem" }}>
            The Democratic Youth Federation of India (DYFI) Dakshina Kannada District Committee is a progressive, democratic youth organization active across the coastal region of Karnataka. We stand for the rights of the youth, promoting fair employment opportunities, secular values, and quality public education.
          </p>
          <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: "1.8", marginBottom: "2rem" }}>
            Our district committee coordinates grassroot units in all major taluks—including Mangaluru, Ullal, Bantwal, Puttur, Belthangady, Moodbidri, Sullia, and Kadaba—bringing together young workers, students, and professionals to build a better tomorrow.
          </p>

          <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "2rem 0" }} />

          <h2 style={{ fontSize: "1.6rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1.25rem" }}>
            Our Core Vision
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <div style={{ padding: "1.25rem", background: "var(--color-bg-light)", borderRadius: "8px", borderLeft: "4px solid var(--color-primary)" }}>
              <h4 style={{ fontWeight: "700", color: "#222", marginBottom: "0.5rem" }}>Secularism & Unity</h4>
              <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
                We actively advocate for communal harmony and mutual respect in coastal Karnataka, organizing regional peace rallies, unity meets, and cultural exchanges to resist divisive narratives.
              </p>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--color-bg-light)", borderRadius: "8px", borderLeft: "4px solid var(--color-primary)" }}>
              <h4 style={{ fontWeight: "700", color: "#222", marginBottom: "0.5rem" }}>Right to Work</h4>
              <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
                We demand fair employment options for regional youth in local public sectors, Port industries, and coastal economic zones, drafting youth employment surveys across the district.
              </p>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--color-bg-light)", borderRadius: "8px", borderLeft: "4px solid var(--color-primary)" }}>
              <h4 style={{ fontWeight: "700", color: "#222", marginBottom: "0.5rem" }}>Social Welfare & Aid</h4>
              <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
                We run a dedicated 24/7 blood donation helpline (+91 9448123456) and mobilize local rescue squads to support coastal communities during monsoons and natural distress events.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
