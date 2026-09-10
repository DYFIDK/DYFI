"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. SUPABASE AUTH ROUTING
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        router.push("/");
        return;
      }

      // 2. BACKWARD-COMPATIBLE OFFLINE FALLBACK AUTH
      if (email === "admin@dyfik.org" && password === "admin123") {
        localStorage.setItem("dyfi-mock-session", "active");
        router.push("/");
      } else {
        throw new Error("Invalid mock credentials. (Use admin@dyfik.org / admin123)");
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "1.5rem", fontFamily: "inherit" }}>
      <div style={{ background: "white", padding: "2.5rem 2rem", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)", width: "100%", maxWidth: "420px", border: "1px solid #e2e8f0" }}>
        
        {/* LOGO TITLE HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/images/logo.png" alt="DYFI Logo" style={{ width: "65px", height: "65px", objectFit: "contain", marginBottom: "1rem" }} />
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>DYFI DAKSHINA KANNADA</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>Admin Control Panel Login</p>
        </div>

        {/* ERROR BOX */}
        {errorMsg && (
          <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1.25rem", fontWeight: "500", lineHeight: "1.4" }}>
            <i className="bi bi-exclamation-circle-fill" style={{ marginRight: "0.4rem" }}></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. admin@dyfik.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", color: "#0f172a" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", color: "#0f172a" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#E31837",
              color: "white",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "background 0.2s"
            }}
          >
            {loading ? (
              <>
                <span className="mini-arc-spinner" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff" }}></span>
                Authenticating...
              </>
            ) : (
              "Sign In to Panel"
            )}
          </button>
        </form>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: "1.5" }}>
            Secured via Supabase authentication client.<br />
            To test locally offline, use credentials above.
          </p>
        </div>

      </div>
    </div>
  );
}
