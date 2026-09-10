import React from "react";

export const metadata = {
  title: "Refund Policy — DYFI Dakshina Kannada",
  description: "Read the official Refund Policy for membership registration fees with the DYFI Dakshina Kannada District Committee.",
};

export default function Refund() {
  return (
    <main>
      {/* Subpage Header Banner */}
      <section className="subpage-header" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #1e0000 100%)", padding: "8rem 2rem 4rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Refund <span style={{ color: "var(--color-primary)" }}>Policy</span></h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>Details regarding transactions and our non-refundable fee model.</p>
      </section>

      {/* Main Content */}
      <section className="legal-page-content" style={{ background: "var(--color-bg-light)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "3rem 2.5rem", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "2rem" }}>Last Updated: August 2026</p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            1. Non-Refundable Subscription Fee
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            The annual subscription fee for the DYFI Dakshina Kannada District Committee membership is set to **₹2.00**. This nominal amount is treated as a voluntary subscription to sustain democratic youth welfare activities, helpdesks, and student camps. Consequently, once a payment is successfully processed, it is strictly **non-refundable**.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            2. Double Payments or Payment Failures
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "2rem" }}>
            In rare cases where network lag causes a payment to register twice or a transaction fails at the UPI gateway (money debited from your bank account but not successfully received by the committee), the gateway provider will auto-reverse the debited amount to your original payment source (bank account or UPI wallet) within 3 to 7 working days.
          </p>

          <h2 style={{ fontSize: "1.4rem", color: "var(--color-primary-dark)", fontWeight: "700", marginBottom: "1rem" }}>
            3. Contact for Support
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.7", marginBottom: "1rem" }}>
            For queries regarding successful registration verification or dynamic card printing, you may contact the District Committee Office via email at <a href="mailto:dyfioffice.dk@gmail.com" style={{ color: "var(--color-primary)", fontWeight: "600" }}>dyfioffice.dk@gmail.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
