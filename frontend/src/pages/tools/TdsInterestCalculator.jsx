import React, { useState, useEffect } from "react";
import { FaCalculator, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsQuestionCircle } from "react-icons/bs";
import WhyCompanySection from "../WhyUs";
import TestimonialsSection from "../TestimonialsSection";
import TrustedBy from "../../components/TrustBy";
import "../../style/tools.css";

// Format currency in INR
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

const TdsInterestCalculator = () => {
  // Input states
  const [tdsAmount, setTdsAmount] = useState(100000);
  const [dueDeductionDate, setDueDeductionDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0]
  );
  const [actualDeductionDate, setActualDeductionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [actualDepositDate, setActualDepositDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isPropertyTds, setIsPropertyTds] = useState(false);

  // Results
  const [lateDeductionInterest, setLateDeductionInterest] = useState(0);
  const [lateDepositInterest, setLateDepositInterest] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [deductionDelayMonths, setDeductionDelayMonths] = useState(0);
  const [depositDelayMonths, setDepositDelayMonths] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  // Auto-calc on change
  useEffect(() => {
    const calculateInterest = () => {
      const amount = Number(tdsAmount) || 0;
      const dueDeduction = new Date(dueDeductionDate);
      const actualDeduction = new Date(actualDeductionDate);
      const actualDeposit = new Date(actualDepositDate);

      if (amount <= 0 || isNaN(dueDeduction.getTime()) || isNaN(actualDeduction.getTime()) || isNaN(actualDeposit.getTime())) {
        setLateDeductionInterest(0);
        setLateDepositInterest(0);
        setTotalInterest(0);
        setDeductionDelayMonths(0);
        setDepositDelayMonths(0);
        return;
      }

      // Calculate due deposit date
      let dueDeposit;
      if (isPropertyTds) {
        // For property TDS: 30 days from end of month of deduction
        const deductionMonthEnd = new Date(actualDeduction.getFullYear(), actualDeduction.getMonth() + 1, 0);
        dueDeposit = new Date(deductionMonthEnd);
        dueDeposit.setDate(deductionMonthEnd.getDate() + 30);
      } else {
        // For other TDS: 7th of next month after deduction
        dueDeposit = new Date(actualDeduction.getFullYear(), actualDeduction.getMonth() + 1, 7);
      }

      // Calculate delay months for deduction
      const deductionDelayMs = actualDeduction - dueDeduction;
      let deductionMonths = 0;
      if (deductionDelayMs > 0) {
        // Calculate months difference
        const years = actualDeduction.getFullYear() - dueDeduction.getFullYear();
        const months = actualDeduction.getMonth() - dueDeduction.getMonth();
        const days = actualDeduction.getDate() - dueDeduction.getDate();
        
        deductionMonths = years * 12 + months + (days > 0 ? 1 : 0);
        if (deductionMonths < 0) deductionMonths = 0;
      }

      // Calculate delay months for deposit
      const depositDelayMs = actualDeposit - dueDeposit;
      let depositMonths = 0;
      if (depositDelayMs > 0) {
        const years = actualDeposit.getFullYear() - dueDeposit.getFullYear();
        const months = actualDeposit.getMonth() - dueDeposit.getMonth();
        const days = actualDeposit.getDate() - dueDeposit.getDate();
        
        depositMonths = years * 12 + months + (days > 0 ? 1 : 0);
        if (depositMonths < 0) depositMonths = 0;
      }

      // Calculate interests
      const deductionInterest = (amount * 0.01) * deductionMonths; // 1% per month
      const depositInterest = (amount * 0.015) * depositMonths; // 1.5% per month

      setLateDeductionInterest(deductionInterest);
      setLateDepositInterest(depositInterest);
      setTotalInterest(deductionInterest + depositInterest);
      setDeductionDelayMonths(deductionMonths);
      setDepositDelayMonths(depositMonths);
    };

    calculateInterest();
  }, [tdsAmount, dueDeductionDate, actualDeductionDate, actualDepositDate, isPropertyTds]);

  return (
    <div className="has-fixed-navbar">
      {/* Hero Section */}
      <section className="calculator-hero bg-[var(--bg-secondary)] flex items-center pt-24 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - 60% */}
            <div className="lg:col-span-3 text-[var(--text-primary)]">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                TDS Late Payment Interest Calculator
              </h1>
              <p className="text-[23px] mb-4 text-[var(--text-secondary)]">
                Calculate interest payable on delayed TDS deductions and deposits as per Section 201(1A) of the Income Tax Act. Get accurate calculations for late deduction (1%) and late deposit (1.5%) interest.
              </p>
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Avoid Penalties</span>
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Accurate Calculations</span>
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Tax Compliance</span>
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Instant Results</span>
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

      {/* TDS Calculator Section */}
      <section className="py-16 bg-[var(--bg-main)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-8 border border-[var(--border-color)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Inputs */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6">TDS Interest Calculator</h2>
                <div className="space-y-6">
                  {/* TDS Amount */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      TDS Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tdsAmount}
                      onChange={(e) => setTdsAmount(Number(e.target.value))}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 mb-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>

                  {/* Due Date of Deduction */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Date on which TDS is required to be deducted
                    </label>
                    <input
                      type="date"
                      value={dueDeductionDate}
                      onChange={(e) => setDueDeductionDate(e.target.value)}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>

                  {/* Actual Deduction Date */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Date on which TDS is deducted
                    </label>
                    <input
                      type="date"
                      value={actualDeductionDate}
                      onChange={(e) => setActualDeductionDate(e.target.value)}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>

                  {/* Actual Date of TDS Deposit */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Actual Date of TDS Deposit
                    </label>
                    <input
                      type="date"
                      value={actualDepositDate}
                      onChange={(e) => setActualDepositDate(e.target.value)}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>

                  {/* Property TDS Checkbox */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isPropertyTds}
                        onChange={(e) => setIsPropertyTds(e.target.checked)}
                        className="mr-3 accent-[var(--color-brand)]"
                      />
                      <span className="text-[var(--text-primary)]">Is this TDS on purchase of Immovable Property? (Section 194IA)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-6">
                <div className="text-4xl md:text-5xl font-bold text-[var(--color-brand)] mb-6">
                  {formatINR(totalInterest || 0)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary)] mb-1">Interest on Late Deduction</p>
                    <span className="font-bold text-[23px] text-[var(--text-primary)]">{formatINR(lateDeductionInterest || 0)}</span>
                  </div>
                  <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary)] mb-1">Interest on Late Deposit</p>
                    <span className="font-bold text-[23px] text-[var(--text-primary)]">{formatINR(lateDepositInterest || 0)}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                  <p className="text-[23px] font-semibold text-[var(--text-primary)]">Total Interest Payable</p>
                  <span className="font-bold text-[23px] text-[var(--color-brand)]">{formatINR(totalInterest || 0)}</span>
                </div>

                <div className="bg-[var(--bg-main)] p-4 rounded-lg text-center border border-[var(--border-color)]">
                  <p className="text-[var(--text-secondary)] text-[19px]">
                    {isPropertyTds 
                      ? 'Property TDS deposit due date: 30 days from end of deduction month.'
                      : 'Standard TDS deposit due date: 7th of the next month after deduction.'
                    }
                  </p>
                </div>

                {(deductionDelayMonths > 0 || depositDelayMonths > 0) && (
                  <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-yellow-500">
                    <h4 className="text-yellow-500 font-semibold mb-2">Delay Summary</h4>
                    {deductionDelayMonths > 0 && (
                      <p className="text-[var(--text-primary)] text-[19px]">Deduction Delay: {deductionDelayMonths} month(s)</p>
                    )}
                    {depositDelayMonths > 0 && (
                      <p className="text-[var(--text-primary)] text-[19px]">Deposit Delay: {depositDelayMonths} month(s)</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informational Sections */}
      {/* Section 1: Understanding TDS Interest */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            Understanding Interest on Late TDS Payments
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              When a business deducts TDS from payments, it must deposit that tax to the government by the due date. If there's any delay – either in deducting the tax or in depositing the deducted tax – the Income Tax Act imposes interest on the late TDS payment. This interest is essentially a compensation to the government for the late remittance of taxes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Interest for Late TDS Deduction</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  If you fail to deduct TDS when it was due, interest is charged at 1% per month or part of a month on the TDS amount. The period of interest is calculated from the date the tax was originally deductible until the date you actually deduct the TDS.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Interest for Late TDS Deposit</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  If TDS was deducted but not deposited to the government by the due date, interest is charged at 1.5% per month or part thereof on the TDS amount. The interest is calculated from the date of actual deduction until the date of deposit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How to Use */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            How to Use the TDS Late Payment Interest Calculator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-[var(--color-brand)] font-semibold mb-2">Enter TDS Amount</h3>
                  <p className="text-[var(--text-secondary)] text-[19px]">Input the amount of tax that was deducted (or should have been deducted). This is the principal on which interest will be calculated.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-[var(--color-brand)] font-semibold mb-2">Provide Due Date of Deduction</h3>
                  <p className="text-[var(--text-secondary)] text-[19px]">Enter the date on which TDS was required to be deducted. This is typically the date of payment to the payee or the transaction date when the tax obligation arose.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-[var(--color-brand)] font-semibold mb-2">Provide Actual Deduction Date</h3>
                  <p className="text-[var(--text-secondary)] text-[19px]">Enter the date on which you actually deducted the TDS. If TDS was deducted on time, this will be the same as the due date.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-[var(--color-brand)] font-semibold mb-2">Provide Actual Date of TDS Deposit</h3>
                  <p className="text-[var(--text-secondary)] text-[19px]">Input the date when the TDS amount was actually deposited to the government (through challan payment).</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="text-[var(--color-brand)] font-semibold mb-2">Specify Property TDS</h3>
                  <p className="text-[var(--text-secondary)] text-[19px]">If the TDS in question is for the purchase of immovable property (Section 194IA), check the box. The calculator will apply the 30-day due date rule.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">6</div>
                <div>
                  <h3 className="text-[var(--color-brand)] font-semibold mb-2">Calculate Interest</h3>
                  <p className="text-[var(--text-secondary)] text-[19px]">The tool will instantly display the interest amount for late deduction and late payment, as well as the total interest payable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-8 bg-[var(--bg-main)]">
        <div className="border-t border-[var(--border-color)] w-full max-w-xs relative">
        
        </div>
      </div>

      {/* Section 3: Frequently Asked Questions */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            Frequently Asked Questions About TDS Interest
          </h2>
          <div className="space-y-4">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">What is a TDS interest calculator and how does it help businesses?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 0 ? '−' : '+'}</span>
              </button>
              {openFaq === 0 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  A TDS interest calculator is an online tool that computes the interest payable on delayed TDS deductions and deposits. It helps businesses calculate exact interest amounts to avoid penalties and ensure compliance with tax laws.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">How is interest on late TDS payment calculated?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 1 ? '−' : '+'}</span>
              </button>
              {openFaq === 1 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Interest is calculated at 1% per month for late deduction and 1.5% per month for late deposit. Even a one-day delay crossing into the next month counts as a full month for interest purposes.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">What is the interest rate for late deduction of TDS versus late deposit of TDS?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 2 ? '−' : '+'}</span>
              </button>
              {openFaq === 2 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Late deduction attracts 1% interest per month, while late deposit attracts 1.5% interest per month. Both are calculated on the TDS amount for the period of delay.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">What are the due dates for TDS payment to avoid interest?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 3 ? '−' : '+'}</span>
              </button>
              {openFaq === 3 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  For standard TDS, payment is due by the 7th of the next month. For property TDS (Section 194IA), it's 30 days from the end of the month in which the transaction takes place.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Why is a one-day delay in TDS payment charged as a full month of interest?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 4 ? '−' : '+'}</span>
              </button>
              {openFaq === 4 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  As per Section 201(1A), interest is charged for the period of delay in months or part thereof. Even a single day delay into the next month is considered as one full month.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Are there penalties or fees in addition to interest for late TDS payments?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 5 ? '−' : '+'}</span>
              </button>
              {openFaq === 5 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Yes, in addition to interest, there may be penalties under Section 271C for failure to deduct TDS and Section 221 for failure to deposit TDS. The penalty amounts vary based on the period of delay.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Is the interest on late TDS deposit tax-deductible or refundable?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 6 ? '−' : '+'}</span>
              </button>
              {openFaq === 6 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  The interest paid on late TDS deposit is not tax-deductible as it's considered a penalty/compensation to the government. It cannot be claimed as a business expense.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 7 ? null : 7)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Can an online TDS interest calculator handle TDS on property transactions (Section 194IA)?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 7 ? '−' : '+'}</span>
              </button>
              {openFaq === 7 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Yes, our calculator specifically handles property TDS by applying the correct due date rule: 30 days from the end of the month in which the transaction takes place, instead of the standard 7th of next month rule.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Why Professional Utilities? */}
      <div className="bg-[var(--bg-main)]">
        <WhyCompanySection />
      </div>

      {/* Section 5: Testimonials */}
      <TestimonialsSection />

      {/* Section 6: Trusted By */}
      <div className="bg-[var(--bg-secondary)]">
        <TrustedBy />
      </div>
    </div>
  );
};

export default TdsInterestCalculator;
