import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import heroVideo from "../assets/hero-video.mp4";
import "../style/hero.css";

export default function HeroPage() {
  return (
    <section className="hero-wrapper">
      {/* Background Video */}
     <video
  className="hero-video"
  src={heroVideo}
  autoPlay
  muted
  loop
/>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <span className="hero-tagline">
          FRESH IDEAS, BUILT TO GROW WITH YOU
        </span>

        <h1 className="hero-title">
          Bring your vision <br />
          to life .
        </h1>

        <p className="hero-description">
          We help startups and growing businesses with professional services,
          compliance, legal support, and digital solutions — all under one roof.
        </p>

        <div className="hero-actions">
          <a href="/about" className="hero-btn primary">
            Learn More
          </a>
          <a href="/contact" className="hero-btn secondary">
            Contact Us
          </a>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="floating-actions">
        <a href="tel:8800932090" className="float-btn call">
          <FontAwesomeIcon icon={faPhone} />
        </a>

        <a href="https://wa.me/918800932090" className="float-btn whatsapp">
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </div>
    </section>
  );
}

