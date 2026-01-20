import React, { useState, useEffect } from "react";
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

const PpfCalculator = () => {
  // Inputs
  const [yearlyInvestment, setYearlyInvestment] = useState(25000);
  const [timePeriod, setTimePeriod] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);

  // Results
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Auto-calc on change
  useEffect(() => {
    const P = Number(yearlyInvestment) || 0;
    const n = Number(timePeriod) || 0;
    const r = Number(interestRate) / 100; // convert to decimal

    if (P <= 0 || n <= 0) {
      setTotalInvestment(0);
      setTotalInterest(0);
      setMaturityValue(0);
      return;
    }

    // PPF calculation formula: F = P × [(1 + i)^n - 1] / i
    const maturity = P * (((1 + r) ** n - 1) / r);
    const totalInvested = P * n;

    setTotalInvestment(totalInvested);
    setTotalInterest(maturity - totalInvested);
    setMaturityValue(maturity);
  }, [yearlyInvestment, timePeriod, interestRate]);

  // Slider ranges
  const minInvestment = 500;
  const maxInvestment = 150000;
  const minYears = 15;
  const maxYears = 50;

  return (
    <div className="has-fixed-navbar">
      {/* Hero Section */}
      <section className="calculator-hero bg-[var(--bg-secondary)] flex items-center pt-24 border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - 60% */}
            <div className="lg:col-span-3 text-[var(--text-primary)]">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                PPF Calculator
              </h1>
              <p className="text-[23px] mb-4 text-[var(--text-secondary)]">
                Use our advanced PPF calculator with the latest interest rate of 7.1% to estimate returns on your Public Provident Fund investment. Plan your long-term tax-free savings effectively.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Tax-Free Returns</span>
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Section 80C Benefits</span>
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Long-Term Wealth</span>
                <span className="bg-[var(--color-brand)] text-white px-3 py-1 rounded text-[19px]">Govt. Backed</span>
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

      {/* PPF Calculator Section */}
      <section className="py-16 bg-[var(--bg-main)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-8 border border-[var(--border-color)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Inputs */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6">PPF Calculator</h2>
                <div className="space-y-6">
                  {/* Yearly Investment */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Yearly Investment (₹)
                    </label>
                    <input
                      type="number"
                      min={minInvestment}
                      max={maxInvestment}
                      value={yearlyInvestment}
                      onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                      className="w-full border border-[var(--border-color)] rounded-lg p-3 mb-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                    <input
                      type="range"
                      min={minInvestment}
                      max={maxInvestment}
                      step={500}
                      value={yearlyInvestment}
                      onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                      className="w-full accent-[var(--color-brand)]"
                    />
                    <div className="flex justify-between text-[19px] text-[var(--text-secondary)] mt-2">
                      <span>₹{minInvestment.toLocaleString('en-IN')}</span>
                      <span>₹{maxInvestment.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Time Period */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Time Period
                    </label>
                    <div className="flex gap-3 items-center mb-3">
                      <input
                        type="number"
                        min={minYears}
                        max={maxYears}
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                        className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                      />
                      <span className="text-[23px] text-[var(--text-secondary)]">Years</span>
                    </div>
                    <input
                      type="range"
                      min={minYears}
                      max={maxYears}
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(Number(e.target.value))}
                      className="w-full accent-[var(--color-brand)]"
                    />
                    <div className="flex justify-between text-[19px] text-[var(--text-secondary)] mt-2">
                      <span>{minYears} Years</span>
                      <span>{maxYears} Years</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block text-[23px] font-semibold text-[var(--text-primary)] mb-3">
                      Rate of Interest
                    </label>
                    <div className="flex gap-3 items-center mb-3">
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                      />
                      <span className="text-[23px] text-[var(--text-secondary)]">%</span>
                    </div>
                    <p className="text-[19px] text-[var(--text-secondary)]">Current PPF interest rate is 7.1% (as of April 2025)</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-[19px] text-[var(--text-secondary)] mb-2">Maturity Value</div>
                  <div className="text-4xl md:text-5xl font-bold text-[var(--color-brand)] mb-6">
                    {formatINR(maturityValue || 0)}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <span className="font-medium text-[var(--text-primary)]">Total Investment</span>
                    <span className="font-bold text-[23px] text-[var(--color-brand)]">{formatINR(totalInvestment || 0)}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <span className="font-medium text-[var(--text-primary)]">Total Interest</span>
                    <span className="font-bold text-[23px] text-[var(--color-brand)]">{formatINR(totalInterest || 0)}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                    <span className="font-medium text-[var(--text-primary)]">Maturity Value</span>
                    <span className="font-bold text-[23px] text-[var(--color-brand)]">{formatINR(maturityValue || 0)}</span>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] p-4 rounded-lg text-center border border-[var(--border-color)]">
                  <p className="text-[var(--text-secondary)] text-[19px]">
                    Did you know? PPF investments are eligible for tax deduction under Section 80C up to ₹1.5 lakh per year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informational Sections */}
      {/* Section 1: What is Public Provident Fund (PPF)? */}
      <section className="bg-[var(--bg-main)] py-16 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            What is Public Provident Fund (PPF)?
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              The Public Provident Fund (PPF) is a government-backed long-term savings scheme introduced by the National Savings Institute of the Ministry of Finance in 1968. It was designed with the primary objective of mobilizing small savings from the public while providing a retirement planning avenue with attractive returns.
            </p>
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              PPF is particularly popular among individuals seeking a stable, risk-free investment option with guaranteed returns. It offers an excellent combination of safety, returns, and tax benefits, making it one of the most preferred tax-saving instruments in India.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg text-center border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Guaranteed Returns</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Offers a government-backed interest rate that is typically higher than regular savings accounts.</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg text-center border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Tax Benefits</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Investments up to ₹1.5 lakh per year qualify for tax deduction under Section 80C of Income Tax Act.</p>
              </div>
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg text-center border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Protection from Creditors</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">PPF accounts have immunity from attachment under court orders or debt recovery proceedings.</p>
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

      {/* Section 2: What is a PPF Calculator? */}
      <section className="bg-[var(--bg-secondary)] py-16 border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            What is a PPF Calculator?
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              A PPF Calculator is an online financial tool designed to help investors estimate the returns, interest earned, and maturity value of their Public Provident Fund investments. It eliminates the complex manual calculations involved in projecting long-term investment outcomes.
            </p>
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              Whether you're a student planning for future educational expenses, a parent saving for your child's education, or an individual preparing for retirement, a PPF calculator simplifies financial planning by providing accurate projections based on your investment parameters.
            </p>

            <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
              <h3 className="text-[var(--color-brand)] font-semibold mb-4 text-center">Benefits of Using Our PPF Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center text-[var(--text-secondary)]"><span className="text-[var(--color-brand)] mr-2">•</span>Instant calculation of maturity amount</li>
                  <li className="flex items-center text-[var(--text-secondary)]"><span className="text-[var(--color-brand)] mr-2">•</span>Year-wise breakdown of interest earned</li>
                  <li className="flex items-center text-[var(--text-secondary)]"><span className="text-[var(--color-brand)] mr-2">•</span>Helps in financial planning and goal setting</li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center text-[var(--text-secondary)]"><span className="text-[var(--color-brand)] mr-2">•</span>Accurate interest calculations with the latest rates</li>
                  <li className="flex items-center text-[var(--text-secondary)]"><span className="text-[var(--color-brand)] mr-2">•</span>Visual representation through charts</li>
                  <li className="flex items-center text-[var(--text-secondary)]"><span className="text-[var(--color-brand)] mr-2">•</span>Comparison of different investment scenarios</li>
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

      {/* Section 3: How to Use Our PPF Calculator */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            How to Use Our PPF Calculator
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              Our PPF calculator is designed to be intuitive and user-friendly. Follow these simple steps to calculate the returns on your PPF investment:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Enter Yearly Investment Amount</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Use the slider or enter a value directly to specify your annual contribution to PPF. The minimum investment allowed is ₹500, and the maximum is ₹1,50,000 per financial year.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Select Investment Period</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Choose the duration for which you plan to invest in PPF. The minimum lock-in period is 15 years, but you can extend it beyond the initial term in blocks of 5 years.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">View Current Interest Rate</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">The calculator displays the current PPF interest rate set by the government (7.1% as of April 2025). This rate is fixed for your calculation but may change in reality over your investment period.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Analyze the Results</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Once you input the required information, the calculator will instantly display your total investment, interest earned, and maturity value.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-4">Pro Tip:</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Try different investment amounts and time periods to see how they affect your returns. This can help you optimize your investment strategy according to your financial goals.</p>
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

      {/* Section 4: How PPF Interest is Calculated */}
      <section className="bg-[var(--bg-secondary)] py-16 border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            How PPF Interest is Calculated
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              Understanding the mathematical formula behind PPF calculations can help you appreciate how your money grows over time. Our calculator uses the following formula to compute the maturity value of your PPF investment:
            </p>

            <div className="bg-[var(--bg-main)] p-6 rounded-lg text-center max-w-md mx-auto border border-[var(--border-color)]">
              <div className="text-2xl font-mono text-[var(--color-brand)] mb-4">F = P × [(1 + i)^n - 1] / i</div>
              <p className="text-[19px] text-[var(--text-secondary)]">Where:</p>
              <ul className="text-[19px] text-[var(--text-secondary)] space-y-1">
                <li><strong className="text-[var(--color-brand)]">F</strong> = Maturity Value of PPF</li>
                <li><strong className="text-[var(--color-brand)]">P</strong> = Annual Installment/Investment</li>
                <li><strong className="text-[var(--color-brand)]">i</strong> = Rate of Interest (in decimal)</li>
                <li><strong className="text-[var(--color-brand)]">n</strong> = Total Number of Years</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Important Points About PPF Interest Calculation</h3>
                <ul className="space-y-2 text-[19px] text-[var(--text-secondary)]">
                  <li>• Interest Compounding: PPF interest is compounded annually</li>
                  <li>• Balance Consideration: Interest is calculated on the lowest balance between the 5th day and the last day of each month</li>
                  <li>• Deposit Timing: For maximum interest, it's advisable to deposit on or before the 5th of each month</li>
                  <li>• Interest Crediting: Interest is credited to the account at the end of each financial year (March 31st)</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-main)] p-4 rounded-lg border border-[var(--border-color)]">
                <h4 className="text-[var(--color-brand)] font-semibold mb-2">Pro Tips to Maximize Returns</h4>
                <ul className="space-y-1 text-[19px] text-[var(--text-secondary)]">
                  <li>• Timing Your Deposits: Make deposits before the 5th of the month</li>
                  <li>• Consistency is Key: Regular annual investments maintain account activity</li>
                  <li>• Maximize Your Contribution: Invest up to ₹1,50,000 annually</li>
                  <li>• Strategic Extensions: Extend account in 5-year blocks after maturity</li>
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

      {/* Section 5: PPF Eligibility & Key Features */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            PPF Eligibility & Key Features
          </h2>
          <div className="text-[var(--text-primary)] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-4">Who Can Open a PPF Account?</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li>• Any resident Indian individual</li>
                  <li>• Guardians on behalf of minors</li>
                  <li>• HUFs (Hindu Undivided Families)</li>
                  <li>• NRIs are not eligible to open a new PPF account</li>
                </ul>
                <p className="text-[19px] text-[var(--text-secondary)] mt-2 opacity-75">Note: An individual can have only one PPF account in their name, except for an additional account operated as a guardian of a minor.</p>
              </div>

              <div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-4">Account Opening & Operation</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li>• Can be opened at authorized banks or post offices</li>
                  <li>• Minimum deposit: ₹500 per financial year</li>
                  <li>• Maximum deposit: ₹1,50,000 per financial year</li>
                  <li>• Deposits can be made in lump sum or in 12 installments</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-[var(--color-brand)] font-semibold mb-4 text-center">Key Features of PPF</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="text-[var(--color-brand)] font-semibold mb-2">Lock-in Period</h4>
                  <p className="text-[var(--text-secondary)] text-[19px]">PPF has a mandatory lock-in period of 15 years. After maturity, you can extend the account in blocks of 5 years.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="text-[var(--color-brand)] font-semibold mb-2">Loan Facility</h4>
                  <p className="text-[var(--text-secondary)] text-[19px]">You can avail a loan against your PPF account from the 3rd financial year up to the 6th year. The loan amount is limited to 25% of the balance.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="text-[var(--color-brand)] font-semibold mb-2">Partial Withdrawal</h4>
                  <p className="text-[var(--text-secondary)] text-[19px]">Partial withdrawals are allowed from the 7th financial year. The maximum withdrawal amount is 50% of the balance at the end of the 4th preceding year.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="text-[var(--color-brand)] font-semibold mb-2">Tax Benefits</h4>
                  <p className="text-[var(--text-secondary)] text-[19px]">Investments in PPF qualify for tax deduction under Section 80C up to ₹1.5 lakh per annum. Both interest and maturity amount are tax-free.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="text-[var(--color-brand)] font-semibold mb-2">Protection from Creditors</h4>
                  <p className="text-[var(--text-secondary)] text-[19px]">The funds in your PPF account cannot be attached under any court order in respect of any debt or liability.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="text-[var(--color-brand)] font-semibold mb-2">Nomination Facility</h4>
                  <p className="text-[var(--text-secondary)] text-[19px]">You can nominate one or more individuals to receive the funds in case of your demise. The nomination can be changed at any time.</p>
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

      {/* Section 6: PPF vs Other Investment Options */}
      <section className="bg-[var(--bg-secondary)] py-16 border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            PPF vs Other Investment Options
          </h2>
          <div className="text-[var(--text-primary)]">
            <p className="text-center max-w-4xl mx-auto mb-8 text-[var(--text-secondary)]">
              Understanding how PPF compares to other investment options can help you make better financial decisions. Here's a comparison of PPF with other popular investment avenues:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)]">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left p-4 text-[var(--color-brand)]">Investment Option</th>
                    <th className="text-center p-4 text-[var(--color-brand)]">Current Returns</th>
                    <th className="text-center p-4 text-[var(--color-brand)]">Risk Level</th>
                    <th className="text-center p-4 text-[var(--color-brand)]">Lock-in Period</th>
                    <th className="text-center p-4 text-[var(--color-brand)]">Tax Benefits</th>
                    <th className="text-center p-4 text-[var(--color-brand)]">Tax on Returns</th>
                    <th className="text-center p-4 text-[var(--color-brand)]">Liquidity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="p-4 font-semibold text-[var(--text-primary)]">PPF</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">7.1% p.a.</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Low (Govt. backed)</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">15 years</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Sec 80C (up to ₹1.5 lakh)</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Tax-free</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Partial withdrawals after 7th year</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="p-4 font-semibold text-[var(--text-primary)]">Fixed Deposit</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">5-6% p.a.</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Low</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Flexible (7 days to 10 years)</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Sec 80C for Tax Saver FD</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Taxable as per income slab</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Premature withdrawal with penalty</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[var(--text-primary)]">Mutual Funds</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">10-12% p.a. (market-linked)</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">High</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">3 years</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">Sec 80C (up to ₹1.5 lakh)</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">LTCG above ₹1 lakh taxed at 10%</td>
                    <td className="text-center p-4 text-[var(--text-secondary)]">No withdrawals before 3 years</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[var(--bg-main)] p-6 rounded-lg mt-8 text-center border border-[var(--border-color)]">
              <h3 className="text-[var(--color-brand)] font-semibold mb-3">Key Insight: PPF is ideal for:</h3>
              <ul className="space-y-1 text-[var(--text-secondary)]">
                <li>• Guaranteed returns with zero risk</li>
                <li>• Long-term wealth accumulation</li>
                <li>• Tax-free returns</li>
                <li>• Disciplined savings habit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-8 bg-[var(--bg-main)]">
        <div className="border-t border-[var(--border-color)] w-full max-w-xs relative">
         
        </div>
      </div>

      {/* Section 7: Frequently Asked Questions About PPF */}
      <section className="bg-[var(--bg-secondary)] py-16 border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            Frequently Asked Questions About PPF
          </h2>
          <div className="space-y-4">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Can I open multiple PPF accounts?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 0 ? '−' : '+'}</span>
              </button>
              {openFaq === 0 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  No, an individual can have only one PPF account in their name. However, you can open an additional account as a guardian on behalf of a minor.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">What happens to a PPF account after maturity?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 1 ? '−' : '+'}</span>
              </button>
              {openFaq === 1 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  After the completion of 15 years, you have three options: close the account and withdraw the entire amount, extend the account for 5 years with contributions, or extend the account for 5 years without contributions (keeping the existing balance to earn interest).
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Can I withdraw money from my PPF account before maturity?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 2 ? '−' : '+'}</span>
              </button>
              {openFaq === 2 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Yes, partial withdrawals are allowed from the 7th financial year onwards. The maximum withdrawal amount is limited to 50% of the balance at the end of the 4th preceding financial year or the end of the year immediately preceding the year of withdrawal, whichever is lower.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">How is the interest on PPF calculated?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 3 ? '−' : '+'}</span>
              </button>
              {openFaq === 3 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Interest on PPF is calculated on the lowest balance between the 5th day and the last day of each month. It is compounded annually and credited to the account at the end of each financial year (March 31st).
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Is it better to invest a lump sum or monthly installments in PPF?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 4 ? '−' : '+'}</span>
              </button>
              {openFaq === 4 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  For maximizing returns, it's advisable to invest a lump sum amount at the beginning of the financial year (preferably by the 5th of April). This ensures that you earn interest on the entire amount for the whole year. However, if you have cash flow constraints, you can make monthly deposits, but try to deposit before the 5th of each month to maximize interest.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Why Professional Utilities? */}
      <div className="bg-[var(--bg-main)]">
        <WhyCompanySection />
      </div>

      {/* Section 9: Testimonials */}
      <TestimonialsSection />

      {/* Section 10: Trusted By */}
      <div className="bg-[var(--bg-secondary)]">
        <TrustedBy />
      </div>
    </div>
  );
};

export default PpfCalculator;
