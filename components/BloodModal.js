"use client";
import React, { useState } from "react";

export default function BloodModal({ isOpen, onClose }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    group: "",
    area: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.group || !formData.area) {
      alert("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const donorEntry = {
        id: "BD-" + Date.now(),
        name: formData.name,
        phone: formData.phone,
        group: formData.group,
        area: formData.area,
        date: new Date().toISOString().split("T")[0],
      };

      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donorEntry),
      });

      if (!res.ok) throw new Error("Failed to save donor registration");

      setIsSuccess(true);
    } catch (err) {
      console.error("Blood donor registration error:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e) => {
    if (e.target.id === "blood-modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="blood-modal-overlay"
      className="modal-overlay-custom"
      style={{ display: "flex" }}
      onClick={handleModalClick}
    >
      <div className="modal-card-custom">
        <div className="modal-header-custom">
          <h3>
            <i className="bi bi-droplet-fill" style={{ color: "#E31837", marginRight: "0.5rem" }}></i>
            Blood Donor Registration
          </h3>
          <button className="close-btn-custom" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>
        <div className="modal-body-custom">
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1.5rem" }}>
                Register as a voluntary donor to save lives. Our district committee will contact you when there is a local requirement.
              </p>

              <div className="form-group-custom">
                <label htmlFor="b-name">Full Name *</label>
                <input
                  type="text"
                  id="b-name"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="b-phone">Phone Number *</label>
                <input
                  type="tel"
                  id="b-phone"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-row-custom">
                <div className="form-group-custom" style={{ flex: 1, marginBottom: 0 }}>
                  <label htmlFor="b-group">Blood Group *</label>
                  <select
                    id="b-group"
                    required
                    style={{ width: "100%" }}
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  >
                    <option value="" disabled>Select Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="form-group-custom" style={{ flex: 1, marginBottom: 0 }}>
                  <label htmlFor="b-area">Area / Taluk *</label>
                  <select
                    id="b-area"
                    required
                    style={{ width: "100%" }}
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  >
                    <option value="" disabled>Select Area</option>
                    <option value="Mangaluru City">Mangaluru City</option>
                    <option value="Ullal">Ullal</option>
                    <option value="Bantwal">Bantwal</option>
                    <option value="Puttur">Puttur</option>
                    <option value="Belthangady">Belthangady</option>
                    <option value="Moodbidri">Moodbidri</option>
                    <option value="Sullia">Sullia</option>
                    <option value="Kadaba">Kadaba</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "0.8rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Registering..." : "Submit Registration"}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
              <div className="checkmark-wrapper">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2 style={{ color: "#2e7d32", fontWeight: 700, margin: "1rem 0 0.5rem", fontSize: "1.4rem", textAlign: "center" }}>
                Thank You!
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#444", marginBottom: "1.25rem", lineHeight: 1.4, textAlign: "center" }}>
                Your details have been successfully registered to the DYFI Dakshina Kannada Blood Donor Directory.
              </p>
              <div
                style={{
                  background: "rgba(227, 24, 55, 0.05)",
                  border: "1px dashed rgba(227, 24, 55, 0.3)",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.25rem", fontWeight: 600, letterSpacing: "0.5px" }}>
                  NEED IMMEDIATE BLOOD EMERGENCY?
                </p>
                <p style={{ fontSize: "1.25rem", color: "#E31837", fontWeight: 800, letterSpacing: "0.5px", margin: "0.25rem 0" }}>
                  <i className="bi bi-telephone-fill"></i> +91 9448123456
                </p>
                <p style={{ fontSize: "0.75rem", color: "#888" }}>DYFI District Blood Helpline Desk (24/7)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
