import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/payment.css";
import logo from "../assets/images/logo.png";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* LEFT SECTION – BRAND */}
        <div className="payment-left">
          <div className="brand">
            <img src={logo} alt="Mr Professional Logo" className="max-w-full h-auto" />
            <h2>Mr Professional</h2>
          </div>

          <p className="tagline">One-Stop Corporate Solution</p>

          {/* OPTIONAL INFO (kept minimal) */}
          <div className="terms">
            <h4>Need Help?</h4>
            <p>
              If you are facing issues with payment, please try again or contact
              our support team for assistance.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION – PAYMENT FAILED */}
        <div className="payment-right">

          {/* Status Icon */}
          <div className="status-icon failed">✕</div>

          {/* Title */}
          <h2 className="section-title">
            Payment Failed
            <span className="underline"></span>
          </h2>

          {/* Message */}
          <p className="status-message">
            Your payment could not be completed due to a technical or bank-related
            issue. Please try again.
          </p>

          {/* Action Button */}
          <button
            className="primary-btn"
            onClick={() => navigate("/payment")}
          >
            Try Again
          </button>

          {/* Reassurance */}
          <p className="reassurance">
            If any amount was deducted, it will be refunded within 3–5 working
            days.
          </p>

        </div>

      </div>
    </div>
  );
}

