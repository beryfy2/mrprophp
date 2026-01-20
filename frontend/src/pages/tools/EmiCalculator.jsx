import React, { useState, useEffect } from "react";
import WhyCompanySection from "../WhyUs";
import TestimonialsSection from "../TestimonialsSection";
import TrustedBy from "../../components/TrustBy";
import "../../style/emi-calculator.css";

/* ================= UTILS ================= */
const formatINR = (value) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `₹${Math.round(value || 0)}`;
  }
};

const DonutChart = ({ principal, interest }) => {
  const total = principal + interest;
  if (!total) return null;

  const principalPercent = Math.round((principal / total) * 100);
  const interestPercent = 100 - principalPercent;

  return (
    <div className="donut-wrap">
      <div
        className="donut"
        style={{
          background: `conic-gradient(
            var(--color-brand) 0% ${principalPercent}%,
            var(--text-secondary) ${principalPercent}% 100%
          )`,
        }}
      />

      <div className="donut-legend">
        <div>
          <span className="legend-dot principal" />
          Principal {principalPercent}%
        </div>
        <div>
          <span className="legend-dot interest" />
          Interest {interestPercent}%
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "What sort of loans can I use the EMI calculator for?",
      a: "You can use our EMI calculator for home loans, personal loans, car loans, education loans, and business loans."
    },
    {
      q: "How does the debt-to-income ratio affect my chances of availing a loan?",
      a: "A lower debt-to-income ratio improves your chances of loan approval. EMI calculator helps you plan better."
    },
    {
      q: "What does an EMI consist of?",
      a: "An EMI consists of two components – principal repayment and interest payment."
    },
    {
      q: "What happens if I fail to pay my EMIs?",
      a: "Failure to pay EMIs can lead to penalties, credit score reduction, and legal action."
    }
  ];

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions (FAQs)</h2>

      <div className="faq-wrapper">
        {/* LEFT – FAQ LIST */}
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? "active" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-question">{item.q}</div>
              <div className="faq-plus">{open === i ? "−" : "+"}</div>

              {open === i && (
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
      
        

/* ================= MAIN ================= */
export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(10);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (!P || !r || !n) return;

    const emiCalc = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emiCalc);
    setTotalPayment(emiCalc * n);
    setTotalInterest(emiCalc * n - P);
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <div className="has-fixed-navbar">
      {/* Hero Section */}
      <section className="calculator-hero bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center pt-24">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - 60% */}
            <div className="lg:col-span-3 text-[var(--text-primary)]">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                EMI Calculator
              </h1>
              <p className="text-[23px] mb-4 text-[var(--text-secondary)]">
                Calculate your Equated Monthly Installment (EMI) for home loans, personal loans, car loans, and more.
                Get accurate EMI calculations instantly based on your loan amount, interest rate, and tenure.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-[19px]">Accurate Calculations</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded text-[19px]">Instant Results</span>
                <span className="bg-green-600 text-white px-3 py-1 rounded text-[19px]">Easy to Use</span>
              </div>
            </div>
            
            {/* Right Side - 40% */}
            <div className="lg:col-span-2 flex justify-end">
              <div className="expert-consultation-form bg-[var(--bg-main)] border-2 border-[var(--color-brand)] rounded-lg p-3 w-full max-w-xs shadow-2xl">
                <h3 className="text-[var(--color-brand)] font-semibold text-center text-[19px] mb-2">Get Expert Consultation</h3>
                <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your interest! We will contact you soon.'); }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="w-full px-2 py-1 text-[17px] rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="w-full px-2 py-1 text-[17px] rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile *"
                    className="w-full px-2 py-1 text-[17px] rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-brand)] text-white text-[17px] py-1.5 rounded font-medium hover:opacity-90 transition-colors"
                  >
                    REQUEST A CALLBACK
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* ================= CALCULATOR (MATCHED) ================= */}
<section className="emi-main">
  <div className="emi-calculator-layout">

    {/* LEFT CONTROLS */}
    <div className="emi-left">

      <h2 className="emi-title">EMI Calculator</h2>

      {/* Loan Amount */}
      <div className="emi-field">
        <label>Loan Amount ₹</label>
        <div className="emi-input-row">
          <input
            type="range"
            min="100000"
            max="50000000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
          />
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
          />
        </div>
      </div>

      {/* Interest */}
      <div className="emi-field">
        <label>Rate of Interest (P.A)</label>
        <div className="emi-input-row">
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
          />
          <div className="emi-suffix">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(+e.target.value)}
            />
            <span>%</span>
          </div>
        </div>
      </div>

      {/* Tenure */}
      <div className="emi-field">
        <label>Loan Tenure</label>
        <div className="emi-input-row">
          <input
            type="range"
            min="1"
            max="30"
            value={tenureYears}
            onChange={(e) => setTenureYears(+e.target.value)}
          />
          <div className="emi-suffix">
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(+e.target.value)}
            />
            <span>Yr</span>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="emi-stats">
        <div>
          <h4>Monthly EMI</h4>
          <p>{formatINR(emi)}</p>
        </div>
        <div>
          <h4>Principal Amount</h4>
          <p>{formatINR(loanAmount)}</p>
        </div>
        <div>
          <h4>Total Interest</h4>
          <p>{formatINR(totalInterest)}</p>
        </div>
        <div>
          <h4>Total Amount</h4>
          <p>{formatINR(totalPayment)}</p>
        </div>
      </div>
    </div>

    {/* RIGHT CHART */}
    <div className="emi-right">
      <DonutChart principal={loanAmount} interest={totalInterest} />
    </div>

  </div>
</section>

{/* ================= EMI FORMULA SECTION ================= */}
<section className="emi-formula-section">
 

  <div className="formula-container">
    <h2>
      The formula to determine loan EMI amount
      <span className="green-underline" />
    </h2>

    <p className="formula-intro">
      There is a specific formula that Mr Professional uses to compute
      the EMI amount for a loan.
    </p>

    <div className="formula-box">
      <span className="formula">
        EMI = <sup>P × R × (1 + R)<sup>N</sup></sup>
        <span className="formula-divider" />
        <sub>(1 + R)<sup>N</sup> − 1</sub>
      </span>
    </div>

    <div className="formula-where">
      <strong>Where-</strong>
      <ul>
        <li>P is the principal amount</li>
        <li>R is the rate of interest</li>
        <li>N is the loan tenure</li>
      </ul>
    </div>

    <p className="formula-note">
      This is the standardized formula used by any online loan calculator.
      Some variables may be added based on the type of loan.
    </p>
  </div>

  {/* PU Divider */}

</section>

      {/* ================= REST (UNCHANGED) ================= */}
      <FAQSection />
      <WhyCompanySection />
      <TestimonialsSection />
      <TrustedBy />
    </div>
  );
}

