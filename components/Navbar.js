"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsActive(!isActive);
  const closeMenu = () => setIsActive(false);

  const isHomepage = pathname === "/";

  return (
    <>
      <header
        id="main-header"
        className={`header ${isHomepage ? "transparent-nav" : ""} ${
          isScrolled ? "scrolled" : ""
        }`}
      >
        <nav className="nav">
          {/* Logo */}
          <Link href="/" className="nav-logo" onClick={closeMenu}>
            <img src="/images/logo.png" alt="DYFI Logo" style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "contain", flexShrink: 0 }} />
            <div className="nav-logo-text">
              <span className="nav-logo-title">DYFI DK DISTRICT</span>
              <span className="nav-logo-subtitle">Dakshina Kannada Committee</span>
            </div>
          </Link>

          {/* Nav Menu */}
          <div className="nav-menu">
            <ul id="nav-links" className={`nav-links ${isActive ? "active" : ""}`}>
              <li>
                <Link href="/" className={pathname === "/" ? "active" : ""} onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li className="dropdown">
                <button className="dropdown-trigger">
                  About Us <i className="bi bi-chevron-down chevron"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/about" onClick={closeMenu}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/committee" onClick={closeMenu}>
                      District Committee
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={closeMenu}>
                      Area Committees
                    </Link>
                  </li>
                  <li>
                    <Link href="/join" onClick={closeMenu}>
                      Join the Movement
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className={pathname === "/campaigns" ? "active" : ""}
                  onClick={closeMenu}
                >
                  Campaigns
                </Link>
              </li>

              <li className="dropdown">
                <button className="dropdown-trigger">
                  Gallery <i className="bi bi-chevron-down chevron"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/gallery" onClick={closeMenu}>
                      Photos
                    </Link>
                  </li>
                  <li>
                    <Link href="#" onClick={closeMenu}>
                      Videos
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/news"
                  className={pathname === "/news" ? "active" : ""}
                  onClick={closeMenu}
                >
                  News
                </Link>
              </li>
              <li>
                <Link href="/#gallery" onClick={closeMenu}>
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/#donateblood" onClick={closeMenu}>
                  Blood Donation
                </Link>
              </li>
              <li>
                <Link href="/join" className="btn-join-nav" onClick={closeMenu}>
                  Join DYFI
                </Link>
              </li>
            </ul>

            {/* Hamburger */}
            <div
              id="hamburger"
              className={`hamburger ${isActive ? "active" : ""}`}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div
        id="mobile-overlay"
        className={`mobile-overlay ${isActive ? "active" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
