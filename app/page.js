"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import StatCounter from "../components/StatCounter";
import BloodModal from "../components/BloodModal";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBloodModalOpen, setIsBloodModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [news, setNews] = useState([]);
  const [activities, setActivities] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchEntity = (entity, setter) => {
      fetch(`/api/${entity}`)
        .then((res) => res.json())
        .then((data) => setter(data))
        .catch((err) => console.log(`Fetch ${entity} failed:`, err));
    };

    fetchEntity("announcements", setAnnouncements);
    fetchEntity("campaigns", setCampaigns);
    fetchEntity("news", setNews);
    fetchEntity("activities", setActivities);
    fetchEntity("committee", setCommittee);
    fetchEntity("gallery", setGallery);
  }, []);

  const slides = [
    {
      img: "/images/hero-banner-1.jpg",
      alt: "DYFI Dakshina Kannada Youth Rally",
    },
    {
      img: "/images/hero-banner-2.jpg",
      alt: "DYFI Dakshina Kannada March",
    },
    {
      img: "/images/hero-banner-3.jpg",
      alt: "DYFI Dakshina Kannada Community Service",
    },
  ];

  // Slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <main>
      {/* HERO SECTION */}
      <section id="home" className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            >
              <img src={slide.img} alt={slide.alt} />
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>

        <div className="hero-content">
          <h1>
            United Youth, <span>Secular Coast</span> — Building a Better Tomorrow
          </h1>
          <p>
            DYFI Dakshina Kannada stands at the forefront of progressive youth struggles, advocating for harmony,
            employment, and democratic rights in the coastal region.
          </p>
          <Link href="/join" className="btn-primary">
            Join DYFI
            <span className="btn-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6.41 21 5 19.59l4.58-4.59L5 10.41 6.41 9l6 6zM12.41 21 11 19.59l4.58-4.59L11 10.41 12.41 9l6 6z" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="hero-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`hero-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="about-inner" style={{ padding: "4rem 1rem", maxWidth: "1300px", margin: "0 auto" }}>
          <h1>
            Empowering the Youth, Safeguarding Secularism –<span> DYFI Dakshina Kannada District Committee</span> Leading Progressive Movements.
          </h1>
          <Link href="/join" className="btn-primary" style={{ marginTop: "1.5rem" }}>
            Read More
            <span className="btn-icon">
              <svg viewBox="0 0 24 24">
                <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
                <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stats-inner" style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1rem" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            <div className="stat-card">
              <h3><StatCounter target="35000" suffix="+" /></h3>
              <p>Active Members</p>
            </div>
            <div className="stat-card">
              <h3><StatCounter target="12" suffix="" /></h3>
              <p>Area Committees</p>
            </div>
            <div className="stat-card">
              <h3><StatCounter target="250" suffix="+" /></h3>
              <p>Blood Requests Met</p>
            </div>
            <div className="stat-card">
              <h3><StatCounter target="50" suffix="+" /></h3>
              <p>Social Campaigns</p>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPAIGNS SECTION */}
      <section id="campaigns" className="campaigns-section">
        <div className="campaigns-inner">
          <div className="section-header">
            <h2>Our <span>Campaigns</span></h2>
            <Link href="/campaigns" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}>
              View All
              <span className="btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
                  <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="campaigns-grid">
            {campaigns.slice(0, 3).map((c) => (
              <div key={c.id} className="campaign-card">
                <div className="campaign-card-img">
                  <img src={c.image || "/images/hero-banner-1.jpg"} alt={c.title} />
                </div>
                <div className="campaign-card-body">
                  <div className="campaign-card-date"><i className="bi bi-calendar3"></i> {c.date}</div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN THE REVOLUTION */}
      <section id="jointherevolution" className="revolution-section">
        <div className="revolution-inner">
          <div className="revolution-card">
            <div className="revolution-text">
              <h1>True <span>transformation</span> begins when the youth unite to challenge injustice and build equality.</h1>
              <Link href="/join" className="btn-primary">
                Join The Movement
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="revolution-image">
              <img src="/images/che-guevara.jpg" alt="Revolution Illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITIES */}
      <section className="campaigns-section" style={{ background: "var(--color-bg-light)" }}>
        <div className="campaigns-inner">
          <div className="section-header">
            <h2>Recent <span>Activities</span></h2>
            <Link href="/activities" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}>
              View All
              <span className="btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
                  <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="campaigns-grid">
            {activities.slice(0, 3).map((a) => (
              <div key={a.id} className="campaign-card">
                <div className="campaign-card-img">
                  <img src={a.image || "/images/hero-banner-2.jpg"} alt={a.title} />
                </div>
                <div className="campaign-card-body">
                  <div className="campaign-card-date"><i className="bi bi-calendar3"></i> {a.date}</div>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="campaigns-section" style={{ background: "var(--color-bg-white)", padding: "5rem 2rem" }}>
        <div className="campaigns-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-header">
            <h2>Official <span>Announcements</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
            {announcements.map((a) => (
              <div key={a.id} style={{ background: "var(--color-bg-light)", padding: "2rem", borderRadius: "12px", borderLeft: "5px solid var(--color-primary)", boxShadow: "var(--shadow-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ background: "rgba(227, 24, 55, 0.1)", color: "var(--color-primary)", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" }}>{a.type || "NOTIFICATION"}</span>
                  <span style={{ fontSize: "0.85rem", color: "#666" }}><i className="bi bi-calendar-event"></i> {a.date}</span>
                </div>
                <h4 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "0.75rem", color: "var(--color-primary-dark)" }}>{a.title || "Announcement Alert"}</h4>
                <p style={{ fontSize: "0.95rem", color: "#444", lineHeight: "1.6" }}>{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISTRICT COMMITTEE */}
      <section id="statecommittee" className="committee-section">
        <div className="committee-inner">
          <div className="section-header">
            <h2>District <span>Committee</span></h2>
            <Link href="/committee" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}>
              View All
              <span className="btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
                  <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="committee-grid">
            {committee.slice(0, 4).map((m) => (
              <div key={m.id} className="committee-card">
                <div className="committee-card-img">
                  {m.image || m.photo ? (
                    <img 
                      src={m.image || m.photo} 
                      alt={m.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div className="placeholder-avatar"><i className="bi bi-person-fill"></i></div>
                  )}
                </div>
                <h3>{m.role}</h3>
                <p>{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOOD DONATION SECTION */}
      <section id="donateblood" className="blood-section">
        <div className="blood-banner">
          <img src="/images/blood-donation-bg.jpg" alt="Blood Donation Camp" />
          <div className="blood-banner-overlay"></div>
          <div className="blood-content">
            <div className="blood-text">
              <h1>A drop of <span>blood</span>, a lifetime for someone!</h1>
              <p>It takes only five minutes for you… but gives someone<br />an entire lifetime!</p>
              <button onClick={() => setIsBloodModalOpen(true)} className="btn-white">
                Donate Blood
                <span className="btn-icon" style={{ color: "#E31837" }}>
                  <svg viewBox="0 0 24 24">
                    <path fill="#E31837" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </span>
              </button>
              <p style={{ fontSize: "0.95rem", marginTop: "1.25rem", fontWeight: "700", color: "white", letterSpacing: "0.5px" }}>
                <i className="bi bi-telephone-fill" style={{ marginRight: "0.25rem", color: "#ff4d4d" }}></i> Emergency Helpline: +91 9448123456
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section id="gallery" className="gallery-section">
        <div className="gallery-inner">
          <div className="section-header">
            <h2>Photo <span>Gallery</span></h2>
            <Link href="/gallery" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}>
              View All
              <span className="btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
                  <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="gallery-grid">
            {gallery.slice(0, 8).map((g) => (
              <div key={g.id} className="gallery-item">
                <img src={g.src || "/images/hero-banner-1.jpg"} alt={g.alt} />
                <div className="gallery-item-overlay">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      <section id="news" className="news-section">
        <div className="news-inner">
          <div className="section-header">
            <h2>Latest <span>News</span></h2>
            <Link href="/news" className="btn-primary" style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}>
              View All
              <span className="btn-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
                  <path d="M5 5v14h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h7v2H5z" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="news-grid">
            {news.slice(0, 3).map((n) => (
              <div key={n.id} className="news-card">
                <div className="news-card-img">
                  <img src={n.image || "/images/hero-banner-1.jpg"} alt={n.title} />
                </div>
                <div className="news-card-body">
                  <div className="news-card-date"><i className="bi bi-calendar3"></i> {n.date}</div>
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOOD MODAL */}
      <BloodModal isOpen={isBloodModalOpen} onClose={() => setIsBloodModalOpen(false)} />
    </main>
  );
}
