import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/achievements.css";



const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const BASE_URL = API_BASE.replace("/api", "");

export default function WorkPage() {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/public/works/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?._id) setWork(data);
        else setError("Work not found");
      })
      .catch(() => setError("Failed to load work"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="loader-page">Loading...</div>
        <Footer />
      </>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <>
        <NavBar />
        <div className="error-page">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />

      {/* ================= HERO ================= */}
      <section className="achievements-hero animated-hero">
        <div className="hero-content">
          <h1 className="hero-title">{work.title}</h1>
        </div>
      </section>

      {/* ================= DETAIL ================= */}
      <section className="achievements-section">
        <div className="work-detail-wrapper">

          {/* LEFT CONTENT */}
          <div className="work-detail-content">
            <div className="achievement-date">
              {new Date(work.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="achievement-text">
              {work.content.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="work-detail-image">
            <img src={`${BASE_URL}${work.photo}`} alt={work.title} />
          </div>

        </div>
      </section>


      <Footer />
    </>
  );
}

