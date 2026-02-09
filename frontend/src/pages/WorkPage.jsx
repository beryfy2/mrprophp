import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
    axios
      .get(`${API_BASE}/public/works/${id}`)
      .then((res) => {
        if (res.data && (res.data._id || res.data.id)) {
          setWork(res.data);
        } else {
          setError("Work not found");
        }
      })
      .catch((err) => {
        console.error("Failed to load work", err);
        setError("Work not found");
      })
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

  // Helper to safely get image URL
  const getImgUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http")) return photo;
    return `${BASE_URL}${photo}`;
  };

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
            <img src={getImgUrl(work.photo)} alt={work.title} />
          </div>

        </div>
      </section>


      <Footer />
    </>
  );
}

