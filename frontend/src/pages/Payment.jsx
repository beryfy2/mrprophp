import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/payment.css";
import logo from "../assets/images/logo.png";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function Payment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/phonepe/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          amount: Number(form.amount),
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* LEFT – INFO */}
        <div className="payment-left">
          <h1 className="section-title">
            Consultancy Services
            <span className="underline"></span>
          </h1>

          <div className="brand">
            <img src={logo} alt="Mr Professional Logo" />
            <h2>Mr Professional</h2>
          </div>

          <p className="tagline">One-Stop Corporate Solution</p>

          <div className="contact">
            <h4>Contact Us</h4>
            <p>📧 info@mrprofessional.co.in</p>
            <p>📞 +91-8800932090</p>
            <p>📞 +91-94157 18705</p>
          </div>

          <div className="terms">
            <h4>Terms & Conditions</h4>
            <p>
              By proceeding with the payment, you agree to share the information
              entered on this page with Mr Professional and PhonePe, in accordance
              with applicable laws and privacy policies.
            </p>
          </div>
        </div>

        {/* RIGHT – FORM */}
        <div className="payment-right">
          <h2 className="section-title">
            Payment Details
            <span className="underline"></span>
          </h2>

          <form onSubmit={handleSubmit} className="payment-form">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address (optional)"
              value={form.address}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Enter Amount (₹)"
              value={form.amount}
              onChange={handleChange}
              required
            />

            {/* PAYMENT BUTTON */}
            <button type="submit" className="primary-btn">
              Proceed to Pay
            </button>

            {/* BACK TO HOME BUTTON */}
            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/")}
              style={{ background: "#6b7280" }}
            >
              Back to Home
            </button>
          </form>

          <p className="reassurance">
            Payments are securely processed via PhonePe.
          </p>
        </div>

      </div>
    </div>
  );
}

