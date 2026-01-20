import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import indiaMap from "../assets/images/india-political-map.png";
import "../style/work.css";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingContactButtons from "../components/FloatingContactButtons";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const IMG_BASE = API_BASE.replace("/api", "");

/* ================= STATES ================= */
const states = [
  { name: "Uttar Pradesh", className: "up" },
  { name: "Haryana", className: "haryana" },
  { name: "Delhi", className: "delhi" },
  { name: "Rajasthan", className: "rajasthan" },
  { name: "Maharashtra", className: "maharashtra" },
  { name: "Andhra Pradesh", className: "andhra" },
  { name: "Tamil Nadu", className: "tamilnadu" },
];

export default function Works() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ================= FETCH WORKS ================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/public/works`)
      .then((res) => setWorks(res.data))
      .catch(() => setError("Failed to load works"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= PULSE SEQUENCE ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % states.length);
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
        <p>Loading works...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <NavBar />

      {/* ================= PAGE CONTENT ================= */}
      <div className="container">
        {/* HEADER */}
        <div className="page-header">
          <h1>Our Works</h1>
          <p>Explore our portfolio of successful projects</p>
        </div>

        {/* WORK GRID */}
        <div className="work-grid">
          {works.map((work) => (
            <div key={work._id} className="work-card">
              <img src={`${IMG_BASE}${work.photo}`} alt={work.title} />
              <div className="work-content">
                <h3>{work.title}</h3>
                <p>{work.content.slice(0, 120)}...</p>
                <Link to={`/works/${work._id}`}>Read More →</Link>
              </div>
            </div>
          ))}
        </div>

        {/* MAP SECTION */}
        <section className="map-section">
          <h2>We’re Serving in 7 States</h2>
          <p>Our active presence across key regions in India</p>

          <div className="map-layout">
            {/* MAP */}
            <div className="map-wrapper">
              <img src={indiaMap} alt="India Map" className="india-map" />

              {/* PULSE AURAS */}
              <div className="pulse-layer">
                {states.map((state, i) => (
                  <div
                    key={state.name}
                    className={`pulse-blob ${state.className} ${
                      i === activeIndex ? "active" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STATE CARDS */}
            <div className="city-grid">
              {states.map((state, i) => (
                <div
                  key={state.name}
                  className={`city-card ${
                    i === activeIndex ? "active" : ""
                  }`}
                >
                  {state.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />
      <FloatingContactButtons />
    </>
  );
}

