"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function JoinPortal() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    area: "",
    status: "Youth",
    college: "",
    memberId: "",
    issueDate: "",
  });

  const [paymentStatus, setPaymentStatus] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const resetFlow = () => {
    setStep(1);
    setFormData({
      name: "",
      phone: "",
      email: "",
      area: "",
      status: "Youth",
      college: "",
      memberId: "",
      issueDate: "",
    });
    setPaymentStatus("");
    setIsVerifying(false);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.area) {
      alert("Please fill out all required fields.");
      return;
    }
    setStep(2);
  };

  const handlePaymentSimulation = () => {
    setIsVerifying(true);
    setPaymentStatus("Contacting payment server...");

    setTimeout(() => {
      setPaymentStatus("Payment of ₹2 successfully confirmed!");

      setTimeout(async () => {
        const generatedId = "DK-2025-" + Math.floor(100000 + Math.random() * 900000);
        const dateToday = new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        // Save member to database
        try {
          const memberEntry = {
            id: generatedId,
            name: formData.name,
            phone: formData.phone,
            area: formData.area,
            type: formData.status,
            date: new Date().toISOString().split("T")[0],
          };

          await fetch("/api/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(memberEntry),
          });
        } catch (err) {
          console.error("Member registration save failed:", err);
        }

        setFormData((prev) => ({
          ...prev,
          memberId: generatedId,
          issueDate: dateToday,
        }));

        setStep(3);
      }, 1000);
    }, 1800);
  };

  return (
    <main
      className="membership-page-wrapper"
      style={{
        paddingTop: "calc(var(--header-height) + 3rem)",
        paddingBottom: "5rem",
        background: "var(--color-bg-light)",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div
        className="membership-container"
        style={{
          background: "var(--color-bg-white)",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "1.5rem",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="modal-header" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>
            <i className="bi bi-person-fill-add"></i> DYFI District Membership Portal
          </h2>
        </div>

        {/* Steps Progress Tracker */}
        <div className="steps-tracker">
          <div className={`step-item ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
            <div className="step-num">{step > 1 ? "✓" : "1"}</div>
            <span className="step-label">Details</span>
          </div>
          <div className={`step-item ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
            <div className="step-num">{step > 2 ? "✓" : "2"}</div>
            <span className="step-label">Pay For Membership</span>
          </div>
          <div className={`step-item ${step === 3 ? "active" : ""}`}>
            <div className="step-num">3</div>
            <span className="step-label">Get Membership</span>
          </div>
        </div>

        <div className="modal-content-panel" style={{ padding: "2.5rem 2rem" }}>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="step-content active">
              <form onSubmit={handleStep1Submit} className="membership-form">
                <div className="form-group">
                  <label htmlFor="m-name">Full Name *</label>
                  <input
                    type="text"
                    id="m-name"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="m-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="m-phone"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="m-email">Email Address</label>
                    <input
                      type="email"
                      id="m-email"
                      placeholder="Optional"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="m-area">Area / Taluk *</label>
                    <select
                      id="m-area"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    >
                      <option value="" disabled>Select Local Area</option>
                      <option value="Mangaluru City">Mangaluru City</option>
                      <option value="Ullal">Ullal</option>
                      <option value="Bantwal">Bantwal</option>
                      <option value="Belthangady">Belthangady</option>
                      <option value="Puttur">Puttur</option>
                      <option value="Sullia">Sullia</option>
                      <option value="Moodbidri">Moodbidri</option>
                      <option value="Kadaba">Kadaba</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="m-status">Membership Type *</label>
                    <select
                      id="m-status"
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Youth">Youth / Worker</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Student College field */}
                {formData.status === "Student" && (
                  <div className="form-group student-fields active" style={{ display: "block" }}>
                    <label htmlFor="m-college">College / Institution Name *</label>
                    <input
                      type="text"
                      id="m-college"
                      placeholder="Enter school or college name"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>
                )}

                <div className="form-actions" style={{ marginTop: "2rem" }}>
                  <Link
                    href="/"
                    className="btn-white"
                    style={{
                      padding: "0.8rem 1.8rem",
                      fontSize: "0.95rem",
                      borderRadius: "var(--radius-full)",
                    }}
                  >
                    Back to Home
                  </Link>
                  <button type="submit" className="btn-primary" style={{ padding: "0.8rem 1.8rem", fontSize: "0.95rem" }}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="step-content active">
              <div className="payment-wrapper">
                <div className="payment-details" style={{ padding: "1.5rem" }}>
                  <p style={{ fontWeight: 500, color: "#555" }}>Annual Membership Subscription Fee</p>
                  <div className="fee-amount" style={{ fontSize: "2.8rem" }}>₹2.00</div>
                </div>

                <div className="upi-scan-box" style={{ marginTop: "1rem" }}>
                  {/* Mock QR code */}
                  <div className="upi-qr-mock"></div>
                  <p className="qr-tip" style={{ fontSize: "0.85rem", maxWidth: "320px", margin: "0.5rem auto 0" }}>
                    Scan QR code using Google Pay, PhonePe, or BHIM UPI app to pay <span>₹2</span>
                  </p>
                </div>

                <p
                  className="payment-status"
                  style={{
                    marginTop: "1.5rem",
                    color: paymentStatus.includes("confirmed") ? "#2e7d32" : "#dfa23b",
                  }}
                >
                  {paymentStatus}
                </p>

                <div className="form-actions" style={{ justifyContent: "center", marginTop: "2.5rem" }}>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={isVerifying}
                    onClick={handlePaymentSimulation}
                    style={{ fontSize: "1.05rem", padding: "0.9rem 2.5rem" }}
                  >
                    {isVerifying ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                        <span className="mini-arc-spinner"></span> Confirming...
                      </span>
                    ) : (
                      "I have paid the ₹2"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="step-content active">
              <div className="card-generation-wrapper">
                <div
                  style={{
                    textAlign: "center",
                    color: "#2e7d32",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <i className="bi bi-patch-check-fill" style={{ fontSize: "1.8rem", verticalAlign: "middle" }}></i>{" "}
                  Membership Activated!
                </div>

                {/* Target print area */}
                <div id="print-card-target" className="membership-card-badge" style={{ margin: "1rem 0" }}>
                  <div className="card-header-badge">
                    <div className="card-logo-d" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="/images/logo.png" alt="DYFI Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <div className="card-header-text">
                      <h4>DYFI DAKSHINA KANNADA</h4>
                      <p>Democratic Youth Federation of India</p>
                    </div>
                  </div>

                  <div className="card-body-badge">
                    <div className="card-photo-box">
                      <i className="bi bi-person-bounding-box"></i>
                    </div>
                    <div className="card-details-badge">
                      <span className="field">NAME</span>
                      <span className="val">{formData.name.toUpperCase()}</span>
                      <span className="field">AREA / UNIT</span>
                      <span className="val">{formData.area.toUpperCase()}</span>
                      <span className="field">STATUS</span>
                      <span className="val">
                        {formData.status === "Student"
                          ? `STUDENT (${formData.college.toUpperCase()})`
                          : "YOUTH"}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer-badge">
                    <div>
                      <span style={{ opacity: 0.6, display: "block", fontSize: "0.4rem" }}>DATE OF ISSUE</span>
                      <span>{formData.issueDate}</span>
                    </div>
                    <div className="card-stamp-seal">SEAL</div>
                    <div>
                      <span style={{ opacity: 0.6, display: "block", fontSize: "0.4rem", textAlign: "right" }}>
                        MEMBER ID
                      </span>
                      <span className="card-id-num">{formData.memberId}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.85rem", color: "#666", textAlign: "center", maxWidth: "420px", lineHeight: "1.5" }}>
                  Keep this card safe. You can print or download it as a reference for local youth activities in the district.
                </p>

                <div
                  className="form-actions"
                  style={{
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "2rem",
                    gap: "1.5rem",
                  }}
                >
                  <button
                    type="button"
                    className="btn-white"
                    onClick={resetFlow}
                    style={{
                      fontSize: "0.95rem",
                      padding: "0.8rem 1.8rem",
                      borderRadius: "var(--radius-full)",
                    }}
                  >
                    New Member
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => window.print()}
                    style={{ fontSize: "0.95rem", padding: "0.8rem 2rem" }}
                  >
                    <i className="bi bi-printer-fill"></i> Print / Save Card
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
