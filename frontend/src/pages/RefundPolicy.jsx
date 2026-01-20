import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <NavBar />

      {/* Header */}
      <section className="bg-[var(--color-brand)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Refund Policy</h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-8 space-y-8">

          {/* Intro */}
          <p className="text-[var(--text-secondary)]">
            This Refund Policy outlines the terms and conditions under which
            refunds may be granted by <strong>Mr. Professional</strong>.
            By availing any of our incubation, compliance, legal, taxation,
            accounting, or advisory services, you agree to this policy.
          </p>

          {/* No Refund */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. No Refund on Completed or Initiated Services</h2>
            <p className="text-[var(--text-secondary)]">
              Once a service request has been initiated, processed, or submitted
              to any government authority or third-party platform, 
              <strong> no refunds shall be provided</strong>.
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Eligibility for Refund</h2>
            <p className="text-[var(--text-secondary)]">
              Refunds may be considered only under the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
              <li>Duplicate payment made for the same service</li>
              <li>Payment deducted but service not initiated</li>
              <li>Service cancelled before any work or documentation begins</li>
            </ul>
          </div>

          {/* Non-refundable */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Non-Refundable Items</h2>
            <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
              <li>Government fees, statutory charges, or filing fees</li>
              <li>Third-party service charges</li>
              <li>Consultation fees once consultation is delivered</li>
              <li>Incubation or mentorship services already commenced</li>
            </ul>
          </div>

          {/* Partial Refund */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Partial Refunds</h2>
            <p className="text-[var(--text-secondary)]">
              If a service is partially completed, Mr. Professional reserves the
              right to deduct charges proportional to the work already performed.
              Any applicable refund will be processed after such deductions.
            </p>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Refund Processing Timeline</h2>
            <p className="text-[var(--text-secondary)]">
              Approved refunds will be processed within 
              <strong> 7–10 working days</strong> from the date of approval and
              credited back to the original mode of payment.
            </p>
          </div>

          {/* Cancellation */}
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Service Cancellation</h2>
            <p className="text-[var(--text-secondary)]">
              Cancellation requests must be submitted in writing via email.
              Verbal or telephonic cancellation requests will not be considered valid.
            </p>
          </div>

          {/* Discretion */}
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Discretion of Mr. Professional</h2>
            <p className="text-[var(--text-secondary)]">
              All refund requests are subject to internal review. 
              The final decision regarding refunds shall rest solely with 
              <strong> Mr. Professional</strong>.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Legal Jurisdiction</h2>
            <p className="text-[var(--text-secondary)]">
              This Refund Policy shall be governed by and interpreted in
              accordance with the laws of India. Any disputes shall be subject
              to the exclusive jurisdiction of Indian courts.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
            <p className="text-[var(--text-secondary)]">
              For refund-related queries, contact us at:
              <br /><br />
              📞 +91 88009 32090, +91 94157 18705 <br />
              🕘 Mon – Sat, 9:00 AM – 6:30 PM <br />
              📧 info@mrprofessional.co.in
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RefundPolicy;

