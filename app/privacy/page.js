import React from "react";

export const metadata = {
  title: "Privacy Policy — DYFI Dakshina Kannada",
  description: "Read the official Privacy Policy regarding how data is managed, stored, and secured by the DYFI Dakshina Kannada District Committee.",
};

export default function Privacy() {
  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Privacy <span style={{ color: "var(--color-primary)" }}>Policy</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>How we protect and manage your registration and donor information.</p>
      </section>

      {/* Main Content */}
      <section className="legal-page-content" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "3rem 2.5rem", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "2rem" }}>Last Updated: August 2026</p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            1. Information Collection
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            When you register for voluntary blood donation or district membership, we collect essential records including your full name, mobile phone number, blood group (for donors), and local area/taluk. Email address is completely optional.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            2. Use of Information
          </h2>
          <div style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            We only use this information to:
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", listStyleType: "disc" }}>
              <li>Coordinate urgent blood donor matching during medical emergencies.</li>
              <li>Validate membership applications in Step 3 card prints.</li>
              <li>Inform you about local community welfare assemblies, cleanup campaigns, and health drives.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            3. Sharing & Privacy Protection
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            Your details are processed internally by authorized members of the DYFI Dakshina Kannada District Committee. We strictly do **not** sell, rent, trade, or share your contact records with corporate entities, advertisers, or third-party marketing services.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            4. Record Removal
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "1rem" }}>
            If you wish to remove your name, phone number, or donor profile from our active directory, please contact our district office at <a href="mailto:dyfioffice.dk@gmail.com" style={{ color: "var(--color-primary)", fontWeight: "600" }}>dyfioffice.dk@gmail.com</a>. We will securely purge your details within 48 hours.
          </p>
        </div>
      </section>
    </main>
  );
}
