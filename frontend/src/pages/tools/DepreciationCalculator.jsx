import React, { useState, useEffect } from "react";
import "../../style/depreciation-calculator.css";

import WhyCompanySection from "../WhyUs";
import TestimonialsSection from "../TestimonialsSection";
import TrustedBy from "../../components/TrustBy";

const formatINR = (value) => {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹${Math.round(value)}`;
  }
};

const DepreciationCalculator = () => {
  // Inputs
  const [purchaseAmount, setPurchaseAmount] = useState(100000);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [depreciationRate, setDepreciationRate] = useState(15);
  const [depreciationMethod, setDepreciationMethod] = useState('WDV'); // SLM or WDV
  const [duration, setDuration] = useState(5);
  const [additionalDepreciation, setAdditionalDepreciation] = useState(false);

  // Results
  const [depreciationSchedule, setDepreciationSchedule] = useState([]);
  const [totalDepreciation, setTotalDepreciation] = useState(0);
  const [finalValue, setFinalValue] = useState(0);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Common depreciation rates
  const commonRates = [
    { label: 'Residential Buildings', rate: 5 },
    { label: 'Commercial Buildings', rate: 10 },
    { label: 'Furniture and Fittings', rate: 10 },
    { label: 'Plant and Machinery', rate: 15 },
    { label: 'Computers and Software', rate: 40 },
    { label: 'Motor Vehicles (Commercial)', rate: 15 },
    { label: 'Motor Vehicles (Personal)', rate: 20 },
    { label: 'Intangible Assets', rate: 25 }
  ];

  // Auto-calc on change
  useEffect(() => {
    const calculateDepreciation = () => {
      const cost = Number(purchaseAmount) || 0;
      const rate = Number(depreciationRate) / 100;
      const years = Number(duration) || 1;

      if (cost <= 0 || rate <= 0) {
        setDepreciationSchedule([]);
        setTotalDepreciation(0);
        setFinalValue(cost);
        return;
      }

      const schedule = [];
      let currentValue = cost;
      let totalDep = 0;

      for (let year = 1; year <= years; year++) {
        let yearlyDep = 0;

        if (depreciationMethod === 'SLM') {
          // Straight Line Method: (Original Cost × Rate) / 100
          yearlyDep = cost * rate;
        } else {
          // Written Down Value Method: (Opening WDV × Rate) / 100
          yearlyDep = currentValue * rate;
        }

        // Apply half-year rule for first year (assuming asset used < 180 days)
        if (year === 1) {
          yearlyDep = yearlyDep / 2;
        }

        // Additional depreciation for first year (if applicable)
        let additionalDep = 0;
        if (additionalDepreciation && year === 1) {
          additionalDep = (cost * 0.20); // 20% additional depreciation
        }

        const totalYearlyDep = yearlyDep + additionalDep;
        const closingValue = Math.max(currentValue - totalYearlyDep, 1); // Minimum ₹1 residual value

        schedule.push({
          year,
          openingValue: currentValue,
          depreciation: yearlyDep,
          additionalDepreciation: additionalDep,
          totalDepreciation: totalYearlyDep,
          closingValue: closingValue
        });

        currentValue = closingValue;
        totalDep += totalYearlyDep;
      }

      setDepreciationSchedule(schedule);
      setTotalDepreciation(totalDep);
      setFinalValue(currentValue);
    };

    calculateDepreciation();
  }, [purchaseAmount, depreciationRate, depreciationMethod, duration, additionalDepreciation]);

  const handleRateSelect = (rate) => {
    setDepreciationRate(rate);
  };

  return (
    <div className="has-fixed-navbar">
      {/* Hero Section */}
      <section className="calculator-hero bg-[var(--bg-main)] flex items-center pt-24 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - 60% */}
            <div className="lg:col-span-3 text-[var(--text-primary)]">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                Depreciation Calculator
              </h1>
              <p className="text-[23px] mb-4 text-[var(--text-secondary)]">
                Calculate depreciation for your assets using Straight Line Method (SLM) or Written Down Value (WDV) as per Income Tax Act and Companies Act in India. Get precise calculations with year-by-year breakdown.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Tax Savings</span>
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Accurate Calculations</span>
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Year-wise Breakdown</span>
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">SLM & WDV Methods</span>
              </div>
            </div>
            
            {/* Right Side - 40% */}
            <div className="lg:col-span-2 flex justify-end">
              <div className="expert-consultation-form bg-[var(--bg-secondary)] border-2 border-[var(--color-brand)] rounded-lg p-3 w-full max-w-xs shadow-2xl">
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
                    className="w-full bg-[var(--color-brand)] text-white py-3 rounded font-semibold hover:bg-[var(--color-brand-hover)] transition-colors"
                  >
                    REQUEST A CALLBACK
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depreciation Calculator Section */}
      <section className="py-16 bg-[var(--bg-main)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-8 border border-[var(--border-color)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Inputs */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6">Depreciation Calculator</h2>
                <div className="space-y-6">
                  {/* Purchase Amount */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Purchase Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 mb-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>

                  {/* Purchase Date */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>

                  {/* Depreciation Rate */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Depreciation Rate (%)
                    </label>
                    <div className="flex gap-3 items-center mb-3">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="0.1"
                        value={depreciationRate}
                        onChange={(e) => setDepreciationRate(Number(e.target.value))}
                        className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                      />
                      <span className="text-[23px] text-[var(--text-secondary)]">%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {commonRates.map((rate) => (
                        <button
                          key={rate.label}
                          onClick={() => handleRateSelect(rate.rate)}
                          className="text-[19px] bg-[var(--bg-main)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2 rounded border border-[var(--border-color)] transition-colors"
                        >
                          {rate.label}: {rate.rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Depreciation Method */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Depreciation Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="SLM"
                          checked={depreciationMethod === 'SLM'}
                          onChange={(e) => setDepreciationMethod(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-[var(--text-primary)]">Straight Line Method (SLM)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="WDV"
                          checked={depreciationMethod === 'WDV'}
                          onChange={(e) => setDepreciationMethod(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-[var(--text-primary)]">Written Down Value (WDV)</span>
                      </label>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Duration (Years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full mt-3"
                    />
                    <div className="flex justify-between text-[19px] text-[var(--text-secondary)] mt-2">
                      <span>1 Year</span>
                      <span>50 Years</span>
                    </div>
                  </div>

                  {/* Additional Depreciation */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={additionalDepreciation}
                        onChange={(e) => setAdditionalDepreciation(e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-[var(--text-primary)]">Eligible for Additional Depreciation (20%)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-[19px] text-[var(--text-secondary)] mb-2">Total Depreciation</div>
                  <div className="text-4xl md:text-5xl font-bold text-[var(--color-brand)] mb-6">
                    {formatINR(totalDepreciation || 0)}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <span className="font-medium text-[var(--text-primary)]">Original Cost</span>
                    <span className="font-bold text-[23px] text-[var(--color-brand)]">{formatINR(purchaseAmount || 0)}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <span className="font-medium text-[var(--text-primary)]">Total Depreciation</span>
                    <span className="font-bold text-[23px] text-[var(--color-danger)]">{formatINR(totalDepreciation || 0)}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <span className="font-medium text-[var(--text-primary)]">Written Down Value</span>
                    <span className="font-bold text-[23px] text-[var(--color-success)]">{formatINR(finalValue || 0)}</span>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] p-4 rounded-lg text-center border border-[var(--border-color)]">
                  <p className="text-[var(--text-primary)] text-[19px]">
                    {depreciationMethod === 'WDV'
                      ? 'WDV method provides higher depreciation in early years, better for tax savings.'
                      : 'SLM method provides uniform depreciation throughout the asset\'s life.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Depreciation Schedule Table */}
            {depreciationSchedule.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-[var(--color-brand)] mb-4">Year-wise Depreciation Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <thead>
                      <tr className="border-b border-[var(--border-color)]">
                        <th className="text-left p-3 text-[var(--color-brand)]">Year</th>
                        <th className="text-right p-3 text-[var(--color-brand)]">Opening WDV</th>
                        <th className="text-right p-3 text-[var(--color-brand)]">Depreciation</th>
                        {additionalDepreciation && <th className="text-right p-3 text-[var(--color-brand)]">Additional Dep.</th>}
                        <th className="text-right p-3 text-[var(--color-brand)]">Total Dep.</th>
                        <th className="text-right p-3 text-[var(--color-brand)]">Closing WDV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depreciationSchedule.map((row) => (
                        <tr key={row.year} className="border-b border-[var(--border-color)]">
                          <td className="p-3 text-[var(--text-primary)]">Year {row.year}</td>
                          <td className="p-3 text-right text-[var(--text-primary)]">{formatINR(row.openingValue)}</td>
                          <td className="p-3 text-right text-[var(--color-danger)]">{formatINR(row.depreciation)}</td>
                          {additionalDepreciation && (
                            <td className="p-3 text-right text-[var(--color-warning)]">{formatINR(row.additionalDepreciation)}</td>
                          )}
                          <td className="p-3 text-right text-[var(--color-danger)]">{formatINR(row.totalDepreciation)}</td>
                          <td className="p-3 text-right text-[var(--color-success)]">{formatINR(row.closingValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Informational Sections */}
      {/* Section 1: Understanding Depreciation in India */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            Understanding Depreciation in India
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              Depreciation represents the reduction in an asset's value due to usage, wear and tear, obsolescence, or market changes. In India, companies must calculate depreciation for both accounting purposes (Companies Act) and tax purposes (Income Tax Act).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Straight Line Method (SLM)</h3>
                <p className="text-[var(--text-secondary)] text-[19px] mb-3">Under SLM, the depreciation runs along at a fixed slice of the asset's starting cost every year. The result is even predictable depreciation across the asset's useful life.</p>
                <div className="bg-[var(--bg-main)] p-3 rounded text-center border border-[var(--border-color)]">
                  <p className="text-[var(--color-brand)] font-mono text-[19px]">Depreciation = (Original Cost × Rate) / 100</p>
                </div>
                <p className="text-[17px] text-[var(--text-secondary)] mt-2">Best for: Assets whose values depreciate uniformly over time</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Written Down Value Method (WDV)</h3>
                <p className="text-[var(--text-secondary)] text-[19px] mb-3">It works on the basis of the reducing book value of the asset, whereby heftier write-offs come in the early years and smaller ones later.</p>
                <div className="bg-[var(--bg-main)] p-3 rounded text-center border border-[var(--border-color)]">
                  <p className="text-[var(--color-brand)] font-mono text-[19px]">Depreciation = (Opening WDV × Rate) / 100</p>
                </div>
                <p className="text-[17px] text-[var(--text-secondary)] mt-2">Best for: Assets whose value depreciates faster during their early years</p>
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

      {/* Section 2: Depreciation Under Income Tax Act */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            Depreciation Under Income Tax Act
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto">
              The Income Tax Act specifies the rate of depreciation on various types of assets. Following are the important points of the Income Tax Act:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] font-bold">•</span>
                  <p className="text-[var(--text-secondary)]">Depreciation for tax purposes is calculated using the written down value method.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] font-bold">•</span>
                  <p className="text-[var(--text-secondary)]">If an asset is used for fewer than 180 days in the first year, a special half-year rule is applied for depreciation.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] font-bold">•</span>
                  <p className="text-[var(--text-secondary)]">New plant and machinery may qualify for additional depreciation.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] font-bold">•</span>
                  <p className="text-[var(--text-secondary)]">Simple calculations are made possible since assets are blocked together.</p>
                </div>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-4">Common Depreciation Rates</h3>
                <div className="space-y-2 text-[19px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Residential Buildings</span>
                    <span className="text-[var(--color-brand)]">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Commercial Buildings</span>
                    <span className="text-[var(--color-brand)]">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Furniture and Fittings</span>
                    <span className="text-[var(--color-brand)]">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Plant and Machinery</span>
                    <span className="text-[var(--color-brand)]">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Computers and Software</span>
                    <span className="text-[var(--color-brand)]">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Motor Vehicles</span>
                    <span className="text-[var(--color-brand)]">15-20%</span>
                  </div>
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

      {/* Section 3: Depreciation Under Companies Act */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            Depreciation Under Companies Act
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto">
              Under the Companies Act, 2013, for the purpose of financial reporting, one can follow SLM or WDV. The estimated assets' lives are given in Schedule II.
            </p>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
              <h3 className="text-[var(--color-brand)] font-semibold mb-4">Key Points Under Companies Act</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="text-[var(--color-brand)] mr-2">•</span>Can use either SLM or WDV method</li>
                  <li className="flex items-center"><span className="text-[var(--color-brand)] mr-2">•</span>Asset lives specified in Schedule II</li>
                  <li className="flex items-center"><span className="text-[var(--color-brand)] mr-2">•</span>Used for financial reporting purposes</li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="text-[var(--color-brand)] mr-2">•</span>No half-year rule like Income Tax Act</li>
                  <li className="flex items-center"><span className="text-[var(--color-brand)] mr-2">•</span>Focus on true and fair view</li>
                  <li className="flex items-center"><span className="text-[var(--color-brand)] mr-2">•</span>Regulatory compliance requirement</li>
                </ul>
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

      {/* Section 4: Additional Depreciation Benefits */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            Additional Depreciation Benefits
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto">
              To incentivize investment in new plant and machinery, extra depreciation is available under the Income Tax Act:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">20% Additional Depreciation</h3>
                <ul className="space-y-2 text-[19px] text-[var(--text-secondary)]">
                  <li>• Available on new plant and machinery</li>
                  <li>• Office equipment and vehicles are excluded</li>
                  <li>• Can be claimed in the year of installation</li>
                  <li>• Reduces taxable income significantly</li>
                </ul>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">35% Additional Depreciation</h3>
                <ul className="space-y-2 text-[19px] text-[var(--text-secondary)]">
                  <li>• For manufacturers in notified backward areas</li>
                  <li>• Higher incentive for specific regions</li>
                  <li>• Additional benefit over regular 20%</li>
                  <li>• Promotes industrial development</li>
                </ul>
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

      {/* Section 5: Advantages of Using Depreciation Calculator */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            Advantages of Using Depreciation Calculator
          </h2>
          <div className="text-[var(--text-primary)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] text-xl">✓</span>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold">Accurate Calculations</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Ensure asset values are always current and calculations are precise.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] text-xl">✓</span>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold">Tax Savings</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Use tax deductions to save money on your tax liability.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] text-xl">✓</span>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold">Asset Replacement Planning</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Think about when to replace assets based on their depreciated value.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] text-xl">✓</span>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold">Method Comparison</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Compare different ways to calculate depreciation (SLM vs WDV).</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] text-xl">✓</span>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold">Detailed Records</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Create clear and detailed depreciation records for compliance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[var(--color-brand)] text-xl">✓</span>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold">Financial Reporting</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Improve the precision of financial reports and statements.</p>
                  </div>
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

      {/* Section 6: How to Use Our Depreciation Calculator */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            How to Use Our Depreciation Calculator
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto">
              Our depreciation calculator is designed to be intuitive and user-friendly. Follow these simple steps to calculate depreciation for your assets:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Enter Purchase Amount</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Input the total cost of the asset in rupees that you want to depreciate.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Select Purchase Date</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Choose the date when the asset was purchased to determine the depreciation period.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Choose Depreciation Rate</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Select the appropriate depreciation rate or choose from common rates for different asset types.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Select Depreciation Method</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Choose between Straight Line Method (SLM) or Written Down Value (WDV) method.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Set Duration</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Specify the number of years over which you want to calculate depreciation.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">6</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Check Additional Depreciation</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">If eligible, check the box for additional depreciation benefits (20% extra).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">7</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">View Results</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Get instant results with total depreciation, written down value, and year-wise breakdown.</p>
                  </div>
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

     {/* Section 7: Frequently Asked Questions */}
<section className="bg-[var(--bg-main)] py-16">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center">
      Frequently Asked Questions About Depreciation
    </h2>

    <div className="space-y-4">
      {[
        {
          q: "What is the difference between SLM and WDV methods?",
          a: "SLM provides uniform depreciation throughout the asset's life, while WDV provides higher depreciation in early years and lower amounts in later years. WDV is mandatory for tax purposes under the Income Tax Act."
        },
        {
          q: "When is additional depreciation applicable?",
          a: "Additional depreciation of 20% is available on new plant and machinery (excluding office equipment and vehicles) in the year of installation. 35% additional depreciation is available for manufacturers in notified backward areas."
        },
        {
          q: "What is the half-year rule for depreciation?",
          a: "If an asset is used for fewer than 180 days in the first year, only half of the normal depreciation is allowed for that year. This rule applies under the Income Tax Act for tax depreciation calculations."
        },
        {
          q: "Why is there a ₹1 residual value in the depreciation table?",
          a: "The ₹1 residual value represents the minimum book value that an asset can have. Even after full depreciation, assets are shown with a nominal value of ₹1 to indicate ownership."
        },
        {
          q: "Which depreciation method is better for tax savings?",
          a: "WDV method is generally better for tax savings as it allows higher depreciation in early years, reducing taxable income more significantly."
        }
      ].map((item, index) => (
        <div
          key={index}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full text-left px-5 py-4 flex justify-between items-center
                       text-[var(--text-primary)] hover:bg-[var(--bg-hover)]
                       transition-colors"
          >
            <span className="font-medium">{item.q}</span>
            <span className="text-[var(--color-brand)] text-xl">
              {openFaq === index ? "−" : "+"}
            </span>
          </button>

          {openFaq === index && (
            <div className="px-5 pb-4 text-[var(--text-secondary)] text-[19px] leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Section 8: Why Professional Utilities? */}
      <div className="bg-[var(--bg-main)]">
        <WhyCompanySection />
      </div>

      {/* Section 9: Testimonials */}
        <div className="bg-[var(--bg-main)]"></div>
      <TestimonialsSection />

      {/* Section 10: Trusted By */}
      <div className="bg-[var(--bg-main)]"></div>
        <TrustedBy />
      </div>
     
  );
};

export default DepreciationCalculator;

