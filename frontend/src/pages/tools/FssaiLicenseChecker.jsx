import React, { useState } from "react";
import WhyCompanySection from "../WhyUs";
import TestimonialsSection from "../TestimonialsSection";
import TrustedBy from "../../components/TrustBy";

const FssaiLicenseChecker = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      if (licenseNumber.length === 14 && /^\d+$/.test(licenseNumber)) {
        // Mock successful result
        setSearchResult({
          status: "Active",
          name: "Sample Food Business Pvt Ltd",
          address: "123, Food Street, New Delhi - 110001",
          businessType: "Food Manufacturing",
          products: "Packaged Foods, Ready-to-Eat Meals"
        });
      } else {
        setSearchResult({
          error: "Please enter a valid 14-digit FSSAI license number"
        });
      }
      setIsSearching(false);
    }, 2000);
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
                FSSAI License Checker
              </h1>
              <p className="text-[23px] mb-4 text-[var(--text-secondary)]">
                Verify FSSAI license status online. Enter your 14-digit FSSAI license number to check validity, business details, and compliance status instantly.
              </p>
              <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Instant Verification</span>
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Official Compliance</span>
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Food Safety Check</span>
                <span className="bg-[var(--bg-secondary)] text-[var(--color-brand)] border border-[var(--color-brand)] px-3 py-1 rounded text-[19px]">Business Validation</span>
              </div>
              <div className="flex items-center mt-4">
                <a href="#google-reviews" className="flex items-center text-[var(--text-primary)] hover:text-[var(--color-brand)] transition-colors">
                  <span className="text-yellow-400 mr-2">★★★★★</span>
                  <span>Google Reviews</span>
                  <span className="ml-2 font-bold">4.9</span>
                </a>
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
                    className="w-full bg-[var(--color-brand)] text-white text-[17px] py-1.5 rounded font-medium hover:bg-[var(--color-brand-hover)] transition-colors"
                  >
                    REQUEST A CALLBACK
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FSSAI License Checker Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-8 border border-[var(--border-color)]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-4">Check FSSAI License Number Status Online</h2>
              <p className="text-[var(--text-secondary)]">
                Enter your 14-digit FSSAI license number to verify the status and get detailed information about the food business.
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value.replace(/\D/g, '').slice(0, 14))}
                  placeholder="Enter 14-digit FSSAI License Number"
                  className="flex-1 border border-[var(--border-color)] rounded-lg p-3 text-[23px] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                  maxLength="14"
                  required
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-[var(--color-brand)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : ''}
                </button>
              </div>
            </form>

            {searchResult && (
              <div className="max-w-2xl mx-auto">
                {searchResult.error ? (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
                    <p className="text-red-400 font-semibold">{searchResult.error}</p>
                  </div>
                ) : (
                  <div className="bg-[var(--bg-main)] rounded-lg p-6 border border-[var(--color-brand)]">
                    <h3 className="text-[var(--color-brand)] font-bold text-[23px] mb-4 text-center">License Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <span className="font-medium text-[var(--text-primary)]">Status:</span>
                        <span className={`font-bold ${searchResult.status === 'Active' ? 'text-[var(--color-brand)]' : 'text-red-500'}`}>
                          {searchResult.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <span className="font-medium text-[var(--text-primary)]">Business Name:</span>
                        <span className="text-[var(--text-secondary)]">{searchResult.name}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <span className="font-medium text-[var(--text-primary)]">Address:</span>
                        <span className="text-[var(--text-secondary)]">{searchResult.address}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <span className="font-medium text-[var(--text-primary)]">Business Type:</span>
                        <span className="text-[var(--text-secondary)]">{searchResult.businessType}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <span className="font-medium text-[var(--text-primary)]">Products:</span>
                        <span className="text-[var(--text-secondary)]">{searchResult.products}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded text-center border border-[var(--color-brand)]/20">
                      <p className="text-[var(--color-brand)] text-[19px]">
                        <strong>Note:</strong> This is a demonstration. For official verification, please visit the 
                        <a href="https://foscos.fssai.gov.in/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-hover)] underline ml-1">
                          official FSSAI portal
                        </a>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Informational Sections */}
      {/* Section 1: What is FSSAI License Number */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            What is FSSAI License Number
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              The Food Safety and Standards Authority of India (FSSAI) assigns each registered or licensed food business operator (FBO) in India a unique 14-digit identification number known as the FSSAI license number. It acts as evidence that the company complies with all safety and quality requirements for the handling, production, distribution, and storage of food and is permitted to operate under the Food Safety and Standards Act, 2006.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Registration Details</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Contains complete information about the food business registration and licensing details.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">License Type</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Indicates whether it's a Basic registration, State license, or Central license.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Validity Period</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Shows the validity period of the license and renewal requirements.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Business Location</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Provides the registered location and operational address of the food business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: FSSAI License Number Format */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            FSSAI License Number Format
          </h2>
          <div className="bg-[var(--bg-main)] rounded-lg p-8 border border-[var(--border-color)] shadow-sm">
            <p className="text-[var(--text-primary)] text-center mb-6">
              Each food business operator (FBO) in India is given a 14-digit unique code known as their FSSAI license number. Every set of numbers in the license number has a distinct meaning that aids in locating information about the food company.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">First Digit (1st)</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Indicates the status of the license – whether it is registered or licensed.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2-3</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Next Two Digits (2nd & 3rd)</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Represent the state code, showing where the food business is registered.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4-5</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Next Two Digits (4th & 5th)</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Indicate the year of registration.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-brand)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">6-8</div>
                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Next Three Digits (6th to 8th)</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">Represent the quantity of enrolling master (how many registrations have been done).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                <div className="h-8 min-w-[44px] px-2 flex items-center justify-center rounded-full bg-[var(--color-brand)] text-white text-[17px] whitespace-nowrap font-bold">9-14
</div>

                  <div>
                    <h3 className="text-[var(--color-brand)] font-semibold mb-2">Next Six Digits (9th to 14th)</h3>
                    <p className="text-[var(--text-secondary)] text-[19px]">A unique license number of the food business operator.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg text-center border border-[var(--border-color)]">
              <p className="text-[var(--color-brand)]">
                <strong>Example:</strong> 10014011000123 (State: Delhi, Year: 2014, Registration Type: License)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Guidelines Related to FSSAI License Number */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            Guidelines Related to FSSAI License Number
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Packaging Display</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  All food packaging, labels, and containers must prominently display the 14-digit FSSAI license number.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Display at Food Premises</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  The license number must be clearly visible at the location of manufacturers, restaurants, cloud kitchens, and food stalls.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Use in Menus & Advertisements</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Food establishments are required to include their license number on all promotional materials, including menus, brochures, and ads.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Verify Validity</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  In order to avoid fines, businesses should make sure their FSSAI license is current and renewed on schedule.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">One License per Location</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  A single FSSAI license number must be obtained for each branch or unit of a food business.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Consumer Right to Verify</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  To ensure authenticity, customers can use the official FSSAI portal to check the license number online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Process of Checking FSSAI License Number Online */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            Process of Checking FSSAI License Number Online
          </h2>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-8 border border-[var(--border-color)] shadow-sm">
            <p className="text-[var(--text-primary)] text-center mb-8">
              The FSSAI license number verification process is simple and can be done by anyone using the official FSSAI online portal. This helps customers confirm if a food business is genuine and compliant with food safety laws.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-2">Go to FSSAI Website</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Visit the official FSSAI website and open the License/Registration Search page.</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-2">Locate Search Option</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Find the License/Registration Search option on the portal.</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-2">Enter License Number</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Enter the 14-digit license number in the search field.</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">4</div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-2">Submit Information</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Click the search button to submit the license number.</p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--color-brand)] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mx-auto mb-4">5</div>
                <h3 className="text-[var(--color-brand)] font-semibold mb-2">View License Details</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">Review the license status, validity, and business information.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://foscos.fssai.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--color-brand)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--color-brand-hover)] transition-colors"
              >
                Visit Official FSSAI Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: FSSAI Renewal */}
      <section className="bg-[var(--bg-secondary)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-6 text-center">
            FSSAI Renewal
          </h2>
          <div className="text-[var(--text-primary)] space-y-6">
            <p className="text-center max-w-4xl mx-auto text-[var(--text-secondary)]">
              The Food Safety and Standards Authority of India (FSSAI) will extend the validity of your food license or registration if you complete the FSSAI renewal process. In order to continue operating lawfully, all food business operators (FBOs), whether they are operating a restaurant, manufacturing facility, food stall, or online delivery service, must renew their FSSAI license before its expiration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-[var(--bg-main)] p-6 rounded-lg text-center border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Validity Period</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  License validity ranges from 1 to 5 years depending on the registration type selected.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg text-center border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Renewal Timeline</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Applications must be submitted at least 30 days before expiration date.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-lg text-center border border-[var(--border-color)]">
                <h3 className="text-[var(--color-brand)] font-semibold mb-3">Renewal Process</h3>
                <p className="text-[var(--text-secondary)] text-[19px]">
                  Submit application, documents, and fees through the FoSCoS portal online.
                </p>
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

      {/* Section 6: Frequently Asked Questions */}
      <section className="bg-[var(--bg-main)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8 text-center">
            Frequently Asked Questions About FSSAI License
          </h2>
          <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--color-brand)]/30 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">How long does it take to get FSSAI registration?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 0 ? '−' : '+'}</span>
              </button>
              {openFaq === 0 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Basic registration is typically processed within 1-2 days, while State and Central licenses may take 15-30 days depending on the complexity and completeness of documentation.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--color-brand)]/30 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">What is FoSCoS FSSAI?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 1 ? '−' : '+'}</span>
              </button>
              {openFaq === 1 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  FoSCoS (Food Safety Compliance System) is the online portal developed by FSSAI for food business operators to apply for licenses, registrations, renewals, and track their applications.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--color-brand)]/30 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">How to check FSSAI application status?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 2 ? '−' : '+'}</span>
              </button>
              {openFaq === 2 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  You can check your FSSAI application status by logging into the FoSCoS portal with your credentials and navigating to the application status section, or by contacting the FSSAI helpline.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--color-brand)]/30 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">How can I check my FSSAI license renewal status?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 3 ? '−' : '+'}</span>
              </button>
              {openFaq === 3 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Renewal status can be checked through the FoSCoS portal by logging in and checking the renewal application status, or by using the license search feature on the FSSAI website.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--color-brand)]/30 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Do I need FSSAI license for homemade food online sales?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 4 ? '−' : '+'}</span>
              </button>
              {openFaq === 4 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Yes, if you're selling homemade food online on a commercial scale, you need FSSAI registration or license. Small-scale home-based businesses may be exempt, but it's advisable to check local regulations.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">How is FSSAI license renewal done?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 5 ? '−' : '+'}</span>
              </button>
              {openFaq === 5 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  FSSAI renewal is done through the FoSCoS portal. Log in, fill the renewal application, upload required documents, pay the renewal fee, and submit. The renewed license is issued upon approval.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Which FSSAI license type for multi-state operations?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 6 ? '−' : '+'}</span>
              </button>
              {openFaq === 6 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  For operations in multiple states, you need a Central License from FSSAI. State licenses are valid only within the issuing state, while Central licenses cover operations across India.
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === 7 ? null : 7)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-[var(--bg-main)] transition-colors"
              >
                <span className="text-[var(--text-primary)] font-medium">Does FSSAI provide training to food business operators?</span>
                <span className="text-[var(--color-brand)] text-xl">{openFaq === 7 ? '−' : '+'}</span>
              </button>
              {openFaq === 7 && (
                <div className="px-4 pb-4 text-[var(--text-secondary)]">
                  Yes, FSSAI provides various training programs for food business operators including food safety training, hygiene practices, and compliance requirements through their training partners and online modules.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Why Professional Utilities? */}
      <div className="bg-[var(--bg-main)]">
        <WhyCompanySection />
      </div>

      {/* Section 8: Testimonials */}
      <TestimonialsSection />

      {/* Section 9: Trusted By */}
      <div className="bg-[var(--bg-main)]">
        <TrustedBy />
      </div>
    </div>
  );
};

export default FssaiLicenseChecker;

