import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/payment.css";
import logo from "../assets/images/logo.png";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

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
            <h4>Payment Completed</h4>
            <p>
              Your transaction has been processed securely.
              Thank you for choosing Mr Professional.
            </p>
          </div>
        </div>

        {/* RIGHT – SUCCESS */}
        <div className="payment-right">

          {/* Success Icon */}
          <div className="status-icon success">✓</div>

          <h2 className="section-title">
            Payment Successful
            <span className="underline"></span>
          </h2>

          <p className="status-message">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>

          {/* Transaction ID */}
          {state?.txnId && (
            <p className="transaction-id">
              <strong>Transaction ID:</strong> {state.txnId}
            </p>
          )}

          {/* Action Button */}
          <button
            className="primary-btn"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>

        </div>

      </div>
    </div>
  );
}

