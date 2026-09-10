import React from "react";

export const metadata = {
  title: "Terms & Conditions — DYFI Dakshina Kannada",
  description: "Read the official Terms and Conditions for membership registrations and portal use with the DYFI Dakshina Kannada District Committee.",
};

export default function Terms() {
  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Terms & <span style={{ color: "var(--color-primary)" }}>Conditions</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Official terms governing membership and portal utilization.</p>
      </section>

      {/* Main Content */}
      <section className="legal-page-content" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "3rem 2.5rem", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "2rem" }}>Last Updated: August 2026</p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            By accessing this portal or registering for membership, you agree to comply with the guidelines, constitution, and objectives of the Democratic Youth Federation of India (DYFI) Dakshina Kannada District Committee.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            2. Membership Registration & Fee
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            The membership subscription fee is set strictly to **₹2.00** annually. This fee is non-refundable and will be utilized entirely for local social service initiatives, student welfare helpdesks, and regional progress drives.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            3. Digital Membership Card
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            The membership card generated through this portal is a digital credential verifying your registration with the Dakshina Kannada District Committee. It is intended for personal reference and participation in authorized local youth welfare assemblies.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            4. Code of Conduct
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "1rem" }}>
            All registered members are expected to uphold the values of secularism, communal harmony, and social equality. Engaging in activities that promote division, communal disharmony, or substance abuse will lead to immediate cancellation of membership credentials.
          </p>
        </div>
      </section>
    </main>
  );
}
