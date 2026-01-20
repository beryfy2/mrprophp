import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/payment.css";
import logo from "../assets/images/logo.png";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function PaymentStatus() {
  const navigate = useNavigate();

  useEffect(() => {
    const txnId = new URLSearchParams(window.location.search).get("txnId");

    if (!txnId) {
      navigate("/payment-failed");
      return;
    }

    fetch(`${API_BASE}/phonepe/status/${txnId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          navigate("/payment-success", { state: { txnId } });
        } else {
          navigate("/payment-failed");
        }
      })
      .catch(() => navigate("/payment-failed"));
  }, [navigate]);

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* LEFT – BRAND */}
        <div className="payment-left">
          <div className="brand">
            <img src={logo} alt="Mr Professional Logo" className="max-w-full h-auto" />
            <h2>Mr Professional</h2>
          </div>

          <p className="tagline">One-Stop Corporate Solution</p>

          <div className="terms">
            <h4>Secure Transaction</h4>
            <p>
              We are securely verifying your payment with the bank. This usually
              takes only a few seconds.
            </p>
          </div>
        </div>

        {/* RIGHT – STATUS */}
        <div className="payment-right">

          {/* Processing Icon */}
          <div className="status-icon pending">⏳</div>

          <h2 className="section-title">
            Verifying Payment
            <span className="underline"></span>
          </h2>

          <p className="status-message">
            Please wait while we confirm your payment. Do not refresh or close
            this page.
          </p>

          <p className="reassurance">
            You will be redirected automatically once the verification is complete.
          </p>

        </div>

      </div>
    </div>
  );
}

